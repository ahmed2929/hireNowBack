const jwt =require("jsonwebtoken");
const bycript =require("bcryptjs")
const {JWT_RefreshToken_ExpireIn,JWT_RefreshToken_Secret,JWT_Token_ExpireIn,JWT_Token_Secret}=require("../../config/index")
const {redis_client} =require("../../config/redisConnect")
const {ApolloError}=require("apollo-server-express")
const User =require("../../modles/User")
const util =require("util");
const console = require("console");

const generateToken=async(id)=>{
    try{

        const token  = jwt.sign(
            {
                sub:id.toString()
            },
           JWT_Token_Secret,
            { expiresIn: JWT_Token_ExpireIn }
        );
    return token

    }catch(err){
        console.debug(err)
        throw err
    }
   
}


const generateRefreshToken=async(id)=>{
    try{

        const refreshtoken  = jwt.sign(
            {
                sub:id.toString()
            },
            JWT_RefreshToken_Secret,
            { expiresIn: JWT_RefreshToken_ExpireIn }
        );

        await redis_client.set(id.toString(),JSON.stringify({token:refreshtoken}),(err,data)=>{
            console.debug("refreshToken craeted redis ",data)
            if(err) throw err;

        })

    return refreshtoken

    }catch(err){
        console.debug(err)
        throw err
    }
   
}

const checkToken=async(token)=>{
    try{

      let  decodedToken = await jwt.verify(token,process.env.JWT_Token_Secret);
      if(!decodedToken){
        const error = new Error('not Authorized!!');
        error.statusCode = 401;
        throw error;
      }
    return decodedToken

    }catch(err){
        console.debug(err)
        throw err
    }
   
}
const checkRefreshToken=async(token)=>{
    try{

      let  decodedToken = await jwt.verify(token,process.env.JWT_RefreshToken_Secret);
      if(!decodedToken){
        const error = new ApolloError('not Authorized!!');
        error.statusCode = 401;
        throw error;
      }
      let get = util.promisify(redis_client.get).bind(redis_client);

      const  data=await get(decodedToken.sub.toString())
        if(data===null){ 
          throw new ApolloError("invalid request token is not stored");
         
        }
        console.debug("data is ",data)
        if(JSON.parse(data).token!=token.toString() ){
            throw new ApolloError("invalid refresh token")
          
        }

     
        return decodedToken

  
     
    }catch(err){
        console.debug(err)
        throw err
    }
   
}

const hashPassword=async(passwod)=>{
    try{
      const hashedPass= await bycript.hash(passwod,12);
      return hashedPass
     

    }catch(err){
        console.debug(err)
        throw err
    }
   
}
const comparePassword=async(Pass,hashedpass)=>{
    try{
      return await bycript.compare(Pass,hashedpass)
      
     

    }catch(err){
        console.debug(err)
        throw err
    }
   
}



const isAuth = async (req, res, next) => {
 
    // Extract Authorization Header
    const authHeader = req.get("Authorization");
 //   console.debug("authHeader is ",req)
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }

    // Extract the token and check for token
    const token = authHeader.split(" ")[1];
    
    if (!token || token === "") {
        req.isAuth = false;
        return next();
    }

    // Verify the extracted token
    let decodedToken;
    try {
        decodedToken = await jwt.verify(token,process.env.JWT_Token_Secret);
    } catch (err) {
        req.isAuth = false;
        return next();
    }

    // If decoded token is null then set authentication of the request false
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }

    // If the user has valid token then Find the user by decoded token's id
    
    let authUser = await User.findById(decodedToken.sub.toString());
    if (!authUser) {
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.user = authUser;
    return next();
}


module.exports={
    generateRefreshToken,
    generateToken,
    checkRefreshToken,
    checkToken,
    hashPassword,
    comparePassword,
    isAuth
}