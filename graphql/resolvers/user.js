const User =require("../../modles/User")
const {generateRefreshToken,generateToken,hashPassword,comparePassword,checkRefreshToken,checkToken}=require("../../helpers/auth/auth")
const {redis_client} =require('../../config/redisConnect');
const { json } = require("express");
module.exports={
     Query :{
        profile:()=>{},
        users:()=>{},
        getNewToken:async(root,args,{req},info)=>{
          const validToken=await checkRefreshToken(args.refreshToken.toString());
          const user_id=validToken.sub._id.toString;
          const token= generateToken(user_id);
          const refreshToken=generateRefreshToken(user_id)
        return{
          token,
          refreshToken
        } 

        },
        logout:async(root,args,{req},info)=>{
          const user =await checkToken(args.token.toString())
          await redis_client.del(user._id.toString(),args.token.toString())
          await redis_client.set('BL_' + user._id.toString(), token);
        },
        
        login:async(root,args,{req},info)=>{
          const exist=await User.findOne({email:args.email})
           if(!exist){
             throw new Error("no user found!")
           }
          const copmare=await comparePassword(args.password.toString(),exist.password.toString())
          if(!copmare){
            throw new Error("password doesnt match")
          }

          const token= generateToken(exist._id);
         const refreshToken=generateRefreshToken(exist._id)
        
         return {
         user:{ ...exist._doc},
        token,
        refreshToken
         }


        }
      
      },
      
       Mutation :{
        register:async(root,args,{req},info)=>{
          console.debug("creating user")
          const exist=await User.findOne({email:args.email})
           if(exist){
             throw new Error("user already exist")
           }
           const hashedPass=await hashPassword(args.password)
         const newUser=new User({
            ...args,
            password:hashedPass
         })
         await newUser.save()
         const token= generateToken(args.email);
         const refreshToken=generateRefreshToken(args.email)
         return {
         user:{ ...newUser._doc},
        token,
        refreshToken
         }


        }
      
      }
}