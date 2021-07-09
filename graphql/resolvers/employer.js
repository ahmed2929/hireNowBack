const Job=require("../../modles/Jobs")

module.exports={
     Query :{
        profile:(root,args,{req},info)=>{
        //   const {name,email,photo,id}=req.user
        
         
        //   return {
        //   name,email,photo,id
        //   }
        },
          
     
        
     
      },
      
       Mutation :{

        createNewJob:async(root,args,{req},info)=>{
        const job= new Job({...args,creator:req.user.id})
        job.bindEmployer(req.user.id,job._id)
        console.debug(" ",{...job._doc})
        await job.save()
         return {
          ...job._doc,
          id:job._id
         }


        }
      

      }
}