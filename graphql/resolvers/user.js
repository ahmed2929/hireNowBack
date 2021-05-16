const User =require("../../modles/User")
const {generateRefreshToken,generateToken,hashPassword,comparePassword}=require("../../helpers/auth/auth")
module.exports={
     Query :{
        profile:()=>{},
        users:()=>{},
        refreshToken:()=>{},
        login:async(root,args,{req},info)=>{
          const exist=await User.findOne({email:args.email})
           if(!exist){
             throw new Error("no user found!")
           }
          const copmare=await comparePassword(args.password.toString(),exist.password.toString())
          if(!copmare){
            throw new Error("password doesnt match")
          }

          const token= generateToken(args.email);
         const refreshToken=generateRefreshToken(args.email)
        
         return {
         user:{ ...exist._doc},
        token,
        refreshToken
         }


        }
      
      },
      
       Mutation :{
        register:async(root,args,{req},info)=>{
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