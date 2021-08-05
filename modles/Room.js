const  mongoose =require ('mongoose');

const schema   = mongoose.Schema;


const Room = new schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
    



},{timestamps:true});






module.exports=mongoose.model('Room',Room);
