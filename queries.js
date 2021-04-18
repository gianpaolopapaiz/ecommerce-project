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

//Send JWT
const sendJWT = (req, res, next) => {
  console.log('Retrieving JWT...')
  let privateKey = fs.readFileSync('./private.pem', 'utf8');
  let token = jwt.sign({ "body": "stuff" }, privateKey, { algorithm: 'HS256'});
  console.log(token);
  res.send({message: 'Sucess!', token: token});
};

module.exports = {
    getProducts,
    checkUsernameEmail,
    registerUser,
    validateCredential,
    sendJWT
  };