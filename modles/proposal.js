const  mongoose =require ('mongoose');
const User=require('./User');
const schema   = mongoose.Schema;
const Job = require('./Jobs');

const Proposal = new schema({
    job_id: {
        type:mongoose.Schema.Types.ObjectId,
         ref:'Job',
         required:true
    
    },
    Comment: {
        type:String,

    },
    file_uri:{ 
    type:String,

    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
         ref:'User',
         required:true
    },
    jobCreator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',

    },
    status:{
        type:String,
        default:'pending',
        enum:['pending','approved','rejected']
    }



},{timestamps:true});



Proposal.pre('save', async function(next) {
    const JobID = this.job_id;
    const applicant = this.applicant;
    const foundJob = await Job.findById(JobID);
    const foundApplicant = await User.findById(applicant);
    console.debug(foundJob,foundApplicant);
    foundJob.proposals.push(this._id);
    foundApplicant.Proposals.push(this._id);
    await foundJob.save();
    await foundApplicant.save();


    next();
  });



module.exports=mongoose.model('Proposal',Proposal);
