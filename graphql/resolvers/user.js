const User =require("../../modles/User")
const {generateRefreshToken,generateToken,hashPassword,comparePassword,checkRefreshToken,checkToken}=require("../../helpers/auth/auth")
const {redis_client} =require('../../config/redisConnect');
const Proposal=require("../../modles/proposal")
const { json } = require("express");
const {registerValidateSchem,loginSchema, loginvalidationSchema} =require("../../validation/auth/auth");
const Jobs = require("../../modles/Jobs");
module.exports={
     Query :{
        profile:(root,args,{req},info)=>{
          console.debug("profile runs")
          const {name,email,photo,id}=req.user
        
         
          return {
          name,email,photo,id
          }
        },
        users:(root,args,{req},info)=>{
          
        },
        getNewToken:async(root,args,{req},info)=>{
          const validToken=await checkRefreshToken(args.refreshToken.toString());
          const user_id=validToken.sub.toString();
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
        
     
      },
      
       Mutation :{
        register:async(root,args,{req},info)=>{
          const {value ,error} =registerValidateSchem.validate(args)
          if(error) throw new Error(error.details[0].message)
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
         const token= generateToken(newUser._id.toString());
         const refreshToken=generateRefreshToken(newUser._id.toString())
         return {
         user:{ ...newUser._doc,id:newUser._id},
        token,
        refreshToken
         }


        },
      

        login:async(root,args,{req},info)=>{
          const {value ,error} =loginvalidationSchema.validate(args)
          if(error) throw new Error(error.details[0].message)
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
          console.debug("user is ", {...exist._doc,id:exist._id})
         return {
         user:{ ...exist._doc,id:exist._id},
        token,
        refreshToken
         }


        },

        summitPropsal:async(root,args,{req},info)=>{
          const jobCreator =await Jobs.findById(args.job_id)
          .select("creator")
          
          const newProposal=new Proposal({
            ...args,
            applicant:req.user.id,
            jobCreator:jobCreator._doc.creator

          })
         await newProposal.save();
         
         return {
          message:"succesfully created proposal"
         }


        }
      

      }
}