const  mongoose =require ('mongoose');

const schema   = mongoose.Schema;


const Message = new schema({
    content: {
        type:String,

    },
    from:{ 
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true

    },
    to :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    
    },
    RoomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room',
        required:true
    }
    



},{timestamps:true});






module.exports=mongoose.model('Message',Message);
