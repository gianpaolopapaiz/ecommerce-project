const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000 //TODO universal variable
const db = require('./queries');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
    res.json({ info: 'Clothecommerce API test' })
});

app.get('/products', db.getProducts);

app.listen(port, () => {
   console.log(`App running on port ${port}.`)
});