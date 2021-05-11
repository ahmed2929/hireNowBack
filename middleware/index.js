const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
//const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
require("dotenv").config();

module.exports= (app)=>{

 // secure HTTP headers
app.use(helmet());

//Enable cors
app.use(cors());

//Against brute attack
const rateLimiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour!",
});

//rate liniter
app.use(rateLimiter);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    limit: "10mb",
    extended: false,
    parameterLimit: 10000,
  })
);

//NoSQL query injection -Data Sanitization
//app.use(mongoSanitize());

//xss attack - Data Sanitization
app.use(xss());

//HTTP parament pollution
app.use(hpp());



app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: `Welcome to PMS API served on port ${port}`,
  });
});

//Handling unhandle routes
app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: "Error 404",
    message: `Page not found. Can't find ${req.originalUrl} on this server`,
  });
});








    return app
}