 const connectDB =require("./config/connectDB")
 const {port} =require("./config")
 const {startApolloServer} =require("./server")
 require("dotenv").config();


const {app,server}=appStartUp()

async function  appStartUp(){

  // // connect to BD
 await connectDB()
 // // setup graph appolo server
 
 return await startApolloServer()
 
}