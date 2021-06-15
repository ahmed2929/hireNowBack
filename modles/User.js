const  mongoose =require ('mongoose');

const schema   = mongoose.Schema;

const User = new schema({
     
    name:{
        type:String,
        required:true
    },
    password: {
        type: String,
        required:true
  },
    email:{
        type:String,
        required:true
    },
    photo:{
      type:String,
      default:'https://img.icons8.com/bubbles/50/000000/user-male.png'
    },
    
    emailVerfied:{
        type:Boolean,
        default:false
    },
    act:{
        type:String,
        enum:['freelancer','employer'],
        required:true
    }
   
  
    


});

module.exports = mongoose.model('User',User);