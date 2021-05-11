 const {DB} =require("./index") 
 const mongoose =require("mongoose")
module.exports= async()=>{
    return mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DATABASE connection successfull"))
  .catch((err) => console.log("Error connecting to database"));
}