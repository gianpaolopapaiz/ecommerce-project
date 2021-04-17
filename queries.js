const bodyParser = require('body-parser')

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

const registerUser = (req, res) => {
  console.log('Post initiated...');
  const userToAdd = req.body.userToAdd;
  console.log(userToAdd);
  //verify existance of user with same username
  pool.query('SELECT user_username FROM users WHERE user_username = $1',['gipppppa'], (error, results) => {
    if (error) {
      res.status(400).send('Error!');
      return
    };
    if(results.rows[0].user_username === userToAdd.userUserName) {
      console.log('Username already in Database!');
      res.status(400).send({message: 'Username already in Database!'});
      return
    }
    console.log('outro');
    res.send({message: 'Success'});
  })
  //REVISAR AQUI

}

module.exports = {
    getProducts,
    registerUser
  };