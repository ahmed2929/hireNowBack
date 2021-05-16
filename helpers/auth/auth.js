const jwt =require("jsonwebtoken");
const bycript =require("bcryptjs")
const {JWT_RefreshToken_ExpireIn,JWT_RefreshToken_Secret,JWT_Token_ExpireIn,JWT_Token_Secret}=require("../../config/index")
const generateToken=async(email)=>{
    try{

        const token  = jwt.sign(
            {
                email:email.toString()
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


const generateRefreshToken=async(email)=>{
    try{

        const token  = jwt.sign(
            {
                email:email.toString()
            },
            JWT_RefreshToken_Secret,
            { expiresIn: JWT_RefreshToken_ExpireIn }
        );
    return token

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


module.exports={
    generateRefreshToken,
    generateToken,
    checkRefreshToken,
    checkToken,
    hashPassword,
    comparePassword
}