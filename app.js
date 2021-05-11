const middleware =require("./middleware")
const express = require("express");
const connectDB =require("./config/connectDB")
const {port} =require("./config")
let app = express();
require("dotenv").config();

// set middleware
app=middleware(app)
connectDB()
//listening to port
app.listen(port, () => {
  console.log(`HireNow Server is running on port ${port}`);
});