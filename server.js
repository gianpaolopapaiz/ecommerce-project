require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.EXPRESS_PORT;
const db = require('./queries');
const cors = require('cors');
const corsOptions = {
  credentials: true,
  origin: 'http://localhost:3000',
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

//app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', db.validateCookie, (req, res) => {
    res.send({ info: 'Clothecommerce API test' })
});

app.get('/products', db.getProducts);

app.post('/register', db.checkUsernameEmail, db.registerUser);

app.post('/login', db.validateCredential, db.sendJWT);

app.post('/validateCookie', db.validateCookie);

app.listen(port, () => {
   console.log(`App running on port ${port}.`)
});