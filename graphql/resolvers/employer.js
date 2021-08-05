const Job=require("../../modles/Jobs")
const Proposals=require("../../modles/proposal")
module.exports={
     Query :{

  



        getJobs:async (root,args,{req},info)=>{
         
          
          /*employer case*/
          if(req.user.act==='2'){
          const jobs =await Job.find({creator:req.user.id})
            .populate('creator')
            return {
              jobs
              
            }

       
           

          


          }else{

            const jobs =await Job.find()
            .populate('creator')
            return {
              jobs,
              
            }



          }






        },

        getJob:async (root,args,{req},info)=>{
         
          
         
         

            const job =await Job.findById(args.id)
            .populate('creator')
            .populate('proposals')
            
           let canApplay=true;
          job.proposals.forEach(element => {
            
            if(element.applicant.toString()===req.user.id.toString()){
              canApplay=false;
            }

          });

            return {
              ...job._doc,
              canApplay
              
            }



          






        },

        getProposals:async (root,args,{req},info)=>{
         
        
         const proposals =await Proposals.find({jobCreator:req.user.id,status:'pending'})
         .populate('applicant')
         .populate('job_id')
         
        

           return {
            proposals:proposals
            
             
            
          }



        






      },
      
     
        
     
      },
      
       Mutation :{

        createNewJob:async(root,args,{req},info)=>{
          console.debug("create job controller runs")
        const job= new Job({...args,creator:req.user.id})
        job.bindEmployer(req.user.id,job._id)
        console.debug(" ",{...job._doc})
        await job.save()
         return {
          ...job._doc,
          id:job._id
         }


        },

        applayToJob:async(root,args,{req},info)=>{
         const {id}=args;
         if(req.user.act==='2'){
           throw new Error('you cant applay to this job')
         }else{
           const job =await Job.findById(id);
           job.candidates.push(req.user.id);
           job.bindUserWithJob(req.user.id,id);
           await job.save();
           return {
             ...job._doc,
           id:job._id
           }


         }



         },

         changeProposalSatus:async(root,args,{req},info)=>{
           console.debug("change proposal status controller runs",args)
          const {id}=args;
          const proposal=await Proposals.findById(id);
          const editJob=await Job.findById(proposal.job_id);
          proposal.status=args.status;
          
          if(proposal.status==='approved'){
            console.debug("if approved")
            editJob.status='1';
            editJob.freelancer=proposal.applicant;
            editJob.save();

          }

          await proposal.save();
          
          return {
            message:"proposal status changed"
          }
 
 
          },  
      

      }
}