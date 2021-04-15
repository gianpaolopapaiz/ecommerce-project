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

module.exports = {
    getProducts
  };