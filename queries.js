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
const addProductToCartDetails = async (req, res, next) => {
  console.log('Adding product to cart detail');
  const productPrice = req.body.productToAdd.product_price;
  const productId = req.body.productToAdd.product_id;
  const cartId = res.locals.cartId; 
  console.log(cartId);
  let sql = 'INSERT INTO cart_details (cart_id, product_id, product_price, cart_details_quantity) VALUES ($1,$2,$3, 1);';
  let values = [cartId, productId, productPrice];
  console.log(values);
  await pool.query(sql, values, (error, results) => {
    if (error) {
      console.log('Error!');
      res.status(400).send({message: 'Error!'});
      return
    }
    console.log('Cart detail added!')
    next();
  });
}

const updateCartAmmount = async (req, res, next) => {
  const cartId = res.locals.cartId;
  console.log(cartId);
  let sql = 'SELECT cart_id, SUM(product_price * cart_details_quantity) AS ammount FROM cart_details WHERE cart_id = $1 GROUP BY cart_id;'
  let values = [cartId];
  console.log(values);
  await pool.query(sql, values, (error, results) => {
    if (error) {
      console.log('Error!');
      res.status(400).send({message: 'Error!'});
      return
    }
    console.log(results.rows);
    const cartAmmount = results.rows[0].ammount;
    console.log(cartAmmount);
    console.log('Retrieved Cart Ammount');
    let sql = 'UPDATE carts SET cart_ammount = $1 WHERE cart_id= $2;';
    let values = [cartAmmount, cartId];
    pool.query(sql, values, (error, results) => {
      if (error) {
        console.log('Error!');
        res.status(400).send({message: 'Error!'});
        return
      }
      console.log('Added to cart!')
      res.send({message: 'Added to cart!'});
    });
  });
}

const sendCartProductArr = async (req, res, next) => {
  const cartId = res.locals.cartId;
  let sql = 'SELECT cart_details.cart_id,cart_details.product_id, products.product_name, cart_details.product_price, COUNT(cart_details.product_id) AS quantity, SUM(cart_details.product_price*cart_details.cart_details_quantity) AS total FROM cart_details JOIN products ON cart_details.product_id = products.product_id WHERE cart_details.cart_id = $1 GROUP BY cart_details.product_id, cart_details.cart_id, cart_details.product_price, products.product_name, cart_details.cart_details_quantity;';
  let values = [cartId];
  await pool.query(sql, values, (error, results) => {
    if (error) {
      console.log('Error!');
      res.status(400).send({message: 'Error!'});
      return
    }
    const cartProductArr = results.rows;
    console.log(cartProductArr);
    sql = 'SELECT cart_id, SUM(product_price*cart_details_quantity)AS total FROM cart_details WHERE cart_id = $1 GROUP BY cart_id;';
    values = [cartId];
    pool.query(sql, values, (error, results) => {
      if (error) {
        console.log('Error!');
        res.status(400).send({message: 'Error!'});
        return
      }
      const cartTotal = results.rows[0];
      console.log(cartTotal);
      res.send({cartProductArr: cartProductArr, cartTotal: cartTotal});
    });
  });
}

const placeOrder = async (req, res, next) => {
  const orderToAdd = req.body.orderToAdd;
  const orderAmmount = moneyToInteger(req.body.orderTotal)
  const orderProductArr = req.body.orderProductArr;
  const userUserName = req.cookies.userUserName;
  const cartId = orderProductArr[0].cart_id
  console.log(orderToAdd);
  console.log(orderAmmount);
  console.log(orderProductArr);
  console.log(cartId);
  console.log(userUserName);
  sql = 'INSERT INTO orders (user_username, cart_id, order_address, order_address_number, order_zip, order_country, order_payment_method, order_shipping_method, order_ammount, order_date, order_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, current_timestamp, $10);';
  values = [userUserName, cartId, orderToAdd.orderAddress, Number(orderToAdd.orderAddressNumber), Number(orderToAdd.orderZip), orderToAdd.orderCountry, orderToAdd.orderMethod, orderToAdd.orderShipping, Number(orderAmmount), 'pending'];
  console.log(values)
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log('Error!');
      res.status(400).send({message: 'Error!'});
      return
    }
    console.log("Created Order!");
    next();
  });
}

const getOrderId = async (req, res, next) => {
  console.log('Getting order_id...')
  const userUserName = req.cookies.userUserName;
  const orderProductArr = req.body.orderProductArr;
  const cartId = orderProductArr[0].cart_id
  sql = 'SELECT order_id FROM orders WHERE user_username = $1 AND cart_id = $2;';
  values = [userUserName, cartId];
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log('Error!');
      res.status(400).send({message: 'Error!'});
      return
    }
    
    res.locals.orderId = results.rows[0].order_id;
    console.log(results.rows[0].order_id);
    next();
  });
}

const insertOrderDetails = (orderProductArr, orderId) => {
  for (let product of orderProductArr) {
    console.log(product)
    let sql = 'INSERT INTO order_details (order_id, product_id, product_price, order_details_quantity) VALUES ($1,$2,$3,$4);';
    let values = [orderId, product.product_id, product.product_price, product.quantity];
    pool.query(sql, values, (error, results) => {
      try {
        console.log('Product added to cart!')
      } catch {
        console.log('Error!'); 
      }     
    })
    console.log('after for')
  }
  console.log('done')
}

const createOrderDetails = async (req, res, next) => {
  // Create cart detail
  console.log('Creating order details...')
  const orderId = res.locals.orderId;
  console.log(orderId);
  const orderProductArr = req.body.orderProductArr;
  insertOrderDetails(orderProductArr, orderId);
  next();
} 

const modifyCartStatus = async (req, res, next) => {
  const orderProductArr = req.body.orderProductArr;
  const cartId = orderProductArr[0].cart_id
  let sql = 'UPDATE carts SET cart_finalized = true WHERE cart_id = $1;';
  let values = [cartId];
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log('Error!');
      res.status(400).send({message: 'Error!'});
      return
    }
    res.status(200).send({message: "Cart finalized!"});
  }); 
}

//Function to transform money text into float
const moneyToInteger = (money) => {
  return money.replace('R$ ', '').replace(',','.');
}

//Retrieve orders for user
const retrieveOrderForUser = (req, res, next) => {
  console.log('Checking if user have orders...');
  const userUserName = req.cookies.userUserName;
  //check if username already have a active cart
  let sql = 'SELECT * FROM orders WHERE user_username = $1 ORDER BY order_date DESC';
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
      console.log('There are no orders available...');
      res.status(400).send([]);
    }
    console.log('User have orders');
    res.status(200).send(results.rows);
  });
};


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
    addProductToCartDetails,
    updateCartAmmount,
    sendCartProductArr,
    placeOrder,
    getOrderId,
    createOrderDetails,
    modifyCartStatus,
    retrieveOrderForUser
  };