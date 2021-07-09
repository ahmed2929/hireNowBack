const  mongoose =require ('mongoose');
const User=require('./User')
const schema   = mongoose.Schema;

const job = new schema({
    title:{
        type:String,
        required:true,
        maxLength:[30,"max length is 30 character"],
        minLength:[5,"min legnth is 5 charcter"]
    },
    jobType:{
        type:String,
        required:true,
    
            enum: {
            values: ['partTime', 'fullTime'],
            message: '{VALUE} is not supported'
        }
    },
    
    country:{
        type:String,
        required:true
    },

    salary:{
        type:Number,
        required:true,
        min:0,
        max:1000
    },
    technologies:[String],
    creator:{
        type:mongoose.Schema.Types.ObjectId,
         ref:'User'
    },
    candidates:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    status:{
        type:String,
         enum: {
            values: ['-1', '0','1'],
            message: '{VALUE} is not supported'
        },
        default:'0'
    }


},{timestamps:true});


 job.methods.bindEmployer = async function (creatorId,jobID){
     try {
        
        const creator=await User.findById(creatorId);
        creator.postedJobs.push(jobID)
        await creator.save();
        return true
        
        
     } catch (error) {
         throw new Error(error)
     }
    
 };

module.exports = mongoose.model('Job',job);