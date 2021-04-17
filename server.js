require('dotenv').config();

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.EXPRESS_PORT 
const db = require('./queries');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//JWT-------------------------------------------------

const jwt = require("jsonwebtoken");
const fs = require('fs');

app.get('/jwt', (req, res) => {
  let privateKey = fs.readFileSync('./private.pem', 'utf8');
  let token = jwt.sign({ "body": "stuff" }, privateKey, { algorithm: 'HS256'});
  res.send(token);
});

function isAuthorized(req, res, next) {
  if (typeof req.headers.authorization !== "undefined") {
      // retrieve the authorization header and parse out the JWT using the split function
      let token = req.headers.authorization.split(" ")[1];
      let privateKey = fs.readFileSync('./private.pem', 'utf8');
      // Here we validate that the JSON Web Token is valid and has been created using the same private pass phrase
      jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {   
          // if there has been an error...
          if (err) {  
              // shut them out!
              res.status(500).json({ error: "Not Authorized" });
          }
          // if the JWT is valid, allow them to hit
          // the intended endpoint
          return next();
      });
  } else {
      // No authorization header exists on the incoming
      // request, return not authorized
      res.status(500).json({ error: "Not Authorized" });
  }
};

//-----------------------------------------------

app.get('/', isAuthorized, (req, res) => {
    res.send({ info: 'Clothecommerce API test' })
});

app.get('/products', db.getProducts);

app.post('/register', db.checkUsernameEmail, db.registerUser);

app.listen(port, () => {
   console.log(`App running on port ${port}.`)
});