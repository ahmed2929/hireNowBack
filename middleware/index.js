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
const {port} =require("../config")
const {isAuth} =require("../helpers/auth/auth")
const multer=require('multer')
const  cloudinary = require('cloudinary').v2;
const path =require("path")
const fs=require("fs")
cloudinary.config({ 
  cloud_name: 'dzxdrtfbw', 
  api_key: '512788788339421', 
  api_secret: 'RCiIvFPr9ATumrqK8-SjQfYOrLU' 
});

var storage=multer.diskStorage({
  destination:(req,file,cb)=>{
      cb(null,'uploads')
  },
  filename:(req,file,cb)=>{
  cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname))
  
  
  
  }
  
  
  
  })

  var upload=multer({
    storage:storage,
   
})  

module.exports= (app)=>{

app.disable("x-powered-by")
 // secure HTTP headers
 app.use(
  helmet({
    /**
     * Default helmet policy + own customizations - graphiql support
     * https://helmetjs.github.io/
     */
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",
          /** @by-us - adds graphiql support over helmet's default CSP */
          "'unsafe-inline'",
        ],
        baseUri: ["'self'"],
        blockAllMixedContent: [],
        fontSrc: ["'self'", 'https:', 'data:'],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        scriptSrc: [
          "'self'",
          /** @by-us - adds graphiql support over helmet's default CSP */
          "'unsafe-inline'",
          /** @by-us - adds graphiql support over helmet's default CSP */
          "'unsafe-eval'",
        ],
        upgradeInsecureRequests: [],
      },
    },
  }),
);
app.use((req,res,next)=>{
console.debug("melle ware runssssssssss")
   next()
})
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
app.use(isAuth)




app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: `Welcome to HireNow API served on port ${port}`,
  });
});

app.post('/upload',upload.any('file'),(req,res)=>{

  cloudinary.uploader.upload(req.files[0].path,{ resource_type: "auto",flags: `attachment:${req.files[0].fieldname}` },
   function(error, result) {
            
       console.debug(error, result);
         
          fs.unlinkSync(req.files[0].path)
          res.json({message:"file saved",url:result.url})
       
        



      }
   );





})






//Handling unhandle routes
app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: "Error 404",
    message: `Page not found. Can't find ${req.originalUrl} on this server`,
  });
});








    return app
}