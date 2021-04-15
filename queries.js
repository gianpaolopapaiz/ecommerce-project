const Pool = require('pg').Pool
const pool = new Pool({ //TODO universal variable
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerceapp_db',
  password: 'jppl2321',
  port: 5432,
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