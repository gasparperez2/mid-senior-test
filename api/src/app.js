const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require("cors")

const loanRoute = require("./routes/loans.js")
const paymentsRoute = require("./routes/payments.js")
const userRoute = require("./routes/users.js");

const { limiter } = require('./middleware/limiter.js');

require('./db.js');

const server = express();

// rate limit middleware
server.use(limiter);

server.name = 'API';

// Enable CORS for all routes
server.use(cors())

// Incoming data request configuration 
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Define routes
server.use("/api/loans", loanRoute);
server.use("/api/payments", paymentsRoute);
server.use("/api/users", userRoute);

server.use((err, req, res, next) => { 
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;