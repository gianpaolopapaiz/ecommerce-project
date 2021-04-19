const bodyParser = require('body-parser');
//JWT
const jwt = require("jsonwebtoken");
const fs = require('fs');

const Pool = require('pg').Pool
require('dotenv').config();

const pool = new Pool({ //TODO universal variable
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT
});

const getProducts = (req, res) => {
    pool.query('SELECT * FROM products', (error, results) => {
      if (error) {
        res.status(400).send('Products not found!');
      }
      res.status(200).send(results.rows);

    })
  };

//verify existance of same username or email in database
const checkUsernameEmail = (req, res, next) => {
  console.log('Post initiated...');
  console.log('Checking username and email in Database...');
  const userToAdd = req.body.userToAdd;
  console.log(userToAdd);
  const sql = 'SELECT user_username, user_email FROM users WHERE user_username = $1 OR user_email = $2';
  const values = [userToAdd.userUserName, userToAdd.userEmail];
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log('Error!');
      res.status(400).send({message: 'Error!'});
      return
    };
    console.log(results.rows[0]);
    if (results.rows[0] !== undefined){
      //if is same username
      if(results.rows[0].user_username === userToAdd.userUserName) {  
        console.log('Username already in Database!');
        res.status(400).send({message: 'Username already in Database!'});
        return 
      };
      //if is same email
      if(results.rows[0].user_email === userToAdd.userEmail) {
        console.log('Email already in Database');
        res.status(400).send({message: 'Email already in Database'});
        return
      };
    };
    console.log('User to add is clear!');
    res.userToAdd = userToAdd;
    next();
  });
};

//Register user on Database
const registerUser = (req, res) => {
  console.log('Registering user in database...');
  const userToAdd = res.userToAdd;
  const sql = "INSERT INTO users (user_first_name, user_last_name, user_email, user_username, user_password) VALUES ($1,$2,$3,$4, crypt($5, gen_salt('bf')));";
  const values = [
    userToAdd.userFirstName, 
    userToAdd.userLastName,
    userToAdd.userEmail,
    userToAdd.userUserName,
    userToAdd.userPassword
  ];
  console.log(values);
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log('Error!');
      res.status(400).send({message: 'Error!'});
      return
    };
    res.send({message: 'Registration success!'});
  });
};

//Login
const validateCredential = (req, res, next) => {
  console.log('Post initiated...');
  console.log('Checking username and password in Database...');
  const credential = req.body.credential;
  console.log(credential);
  const sql = 'SELECT user_username, user_password FROM users WHERE user_username = $1 AND user_password = crypt($2, user_password);';
  const values = [credential.userUserName, credential.userPassword];
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log('Error!');
      res.status(400).send({message: 'Error!'});
      return
    };
    console.log(results.rows[0]);
    if (results.rows[0] === undefined){
      console.log('Wrong credentials!');
      res.status(400).send({message: 'Wrong credentials!'});
      return 
    }
    console.log('Valid credentials!');
    next();
  });
};

//Send Cookie with JWT
const sendJWT = (req, res, next) => {
  const credential = req.body.credential;
  console.log('Retrieving JWT...')
  let privateKey = fs.readFileSync('./private.pem', 'utf8');
  let token = jwt.sign({ "body": "stuff" }, privateKey, { algorithm: 'HS256'});
  console.log(token);
  res.cookie('token', token, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true }); //expires 1 hour
  res.cookie('userUserName', credential.userUserName, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true }); //expires 1 hour
  res.status(200).send({message: 'Logged In!'});
};

//validate credentials on cookies
const validateCookie = (req, res, next) => {
  console.log('Validating client token...')
  console.log(req.cookies.token);
  console.log(req.cookies.userUserName);
  if (typeof req.cookies.token !== "undefined") {
      // retrieve the authorization header and parse out the JWT using the split function
      let token = req.cookies.token;
      let userUserName = req.cookies.userUserName;
      let privateKey = fs.readFileSync('./private.pem', 'utf8');
      // Here we validate that the JSON Web Token is valid and has been created using the same private pass phrase
      jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {   
          // if there has been an error...
          if (err) {  
              // shut them out!
              res.status(500).send({ message: "Not Authorized" });
          }
          // if the JWT is valid, allow them to hit
          // the intended endpoint
          //return res.send({message: 'Authorized', userUserName: userUserName});
          next();
      });
  } else {
      // No authorization header exists on the incoming
      // request, return not authorized
      res.status(500).send({ message: "Not Authorized" });
  }
};

//Simple response after validating cookie, used on login page
const validateCookieResponse = (req, res, next) => {
  const userUserName = req.cookies.userUserName;
  return res.send({message: 'Authorized', userUserName: userUserName});
}

//Check active cart for user
const checkCartForUser = (req, res, next) => {
  console.log('Checking if user have an active cart...');
  const userUserName = req.cookies.userUserName;
  //check if username already have a active cart
  let sql = 'SELECT user_username, cart_id FROM carts WHERE user_username = $1 AND cart_finalized = false';
  let values = [userUserName];
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log('Error!');
      res.status(400).send({message: 'Error!'});
      return
    }
    console.log(results.rows[0]);
    if (results.rows[0] === undefined){
      //add new cart for username
      console.log('Creating cart for username...');
      sql = 'INSERT INTO carts (user_username, cart_ammount, cart_finalized) VALUES ($1,$2, false);';
      values = [userUserName, 0];
      pool.query(sql, values, (error, results) => {
        if (error) {
          console.log('Error!');
          res.status(400).send({message: 'Error!'});
          return
        }
        console.log('Cart created for user');
        next();
      });
    }
    console.log('User have active cart');
    next(); 
  });
};

//retrieve cart_id
const retrieveCartId = async (req, res, next) => {
  console.log('Retrieving cart id...');
  const userUserName = req.cookies.userUserName;
  //check if username already have a active cart
  let sql = 'SELECT user_username, cart_id FROM carts WHERE user_username = $1 AND cart_finalized = false';
  let values = [userUserName];
  await pool.query(sql, values, (error, results) => {
    if (error) {
      console.log('Error!');
      res.status(400).send({message: 'Error!'});
      return
    }
    console.log(results.rows[0]);
    if (results.rows[0] === undefined){
      console.log('Error!');
      res.status(400).send({message: 'Error!'});
      return
    }
    res.locals.cartId = results.rows[0].cart_id;
    console.log('Cart id retrieved');
    next();
  });
};


//add product to cart detail
const addProductToCartDetails = (req, res, next) => {
  console.log('Adding product to cart detail');
  const productPrice = req.body.productToAdd.product_price;
  const productId = req.body.productToAdd.product_id;
  const cartId = res.locals.cartId; 
  console.log(cartId);
  let sql = 'INSERT INTO cart_details (cart_id, product_id, product_price, cart_datails_quantity) VALUES ($1,$2,$3, 1);';
  let values = [cartId, productId, productPrice];
  console.log(values);
  //CONTINUAR DAQUI
  
}


module.exports = {
    getProducts,
    checkUsernameEmail,
    registerUser,
    validateCredential,
    sendJWT,
    validateCookie,
    validateCookieResponse,
    checkCartForUser,
    retrieveCartId,
    addProductToCartDetails
  };