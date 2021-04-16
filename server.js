require('dotenv').config();

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.EXPRESS_PORT //TODO universal variable
const db = require('./queries');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
    res.send({ info: 'Clothecommerce API test' })
});

app.get('/products', db.getProducts);

app.post('/register', db.registerUser);

app.listen(port, () => {
   console.log(`App running on port ${port}.`)
});