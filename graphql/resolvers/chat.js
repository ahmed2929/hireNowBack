const Message=require("../../modles/Message")
const User=require("../../modles/User")
const Room =require("../../modles/Room")
const {PubSub} =require('apollo-server-express')
const { subscribe } = require("graphql")
const pubsub=new PubSub()
module.exports={
     Query :{
        getChatRooms:async (root,args,{req},info)=>{
          

          const ChatRoomUsers=await Room.find({
            participants:{$in:[req.user._id]}

          }).populate("participants messages").exec()

          const finalResult=[]

         const otherPepole=ChatRoomUsers.map(elem=>{
           
          
           return elem.participants.filter(p=>{
            
            if(p._id!=req.user.id){
              console.debug("condition runs")
              finalResult.push({
                roomId:elem._id,
                latestMessage:elem.messages[elem.messages.length-1],
                user:{
                  id:p._id,
                  name:p.name,
                  photo:p.photo,

                }
              })
              return 
            }
              
          
          
          
          })[0]
         })
         console.debug(finalResult)
         
            return {
              ChatRoomUsers:finalResult,
              
              
            }

       
           

          


         






        },

        getChat:async (root,args,{req},info)=>{
         
          
         
         

            const Messages =await Room.findById(args.RoomId)
              .populate([
                // here array is for our memory. 
                // because may need to populate multiple things
                {
                    path: 'messages',
                
                   
                     populate: { path: 'messages.from'},
                     populate: { path: 'messages.to'},
                     lean:true
    
                },
    
               
    
            ])
            .lean()
            console.debug(Messages.messages)


            return {
                messages:Messages.messages
              
            }



          






        },

     
     
        
     
      },
      
       Mutation :{

        sendMessage:async(root,args,{req},info)=>{
            const user =await User.findById(args.to);
            if(!user){
                throw new Error("User not found");
            }
            let newRoom;
            if(!args.roomId){
                newRoom=new Room({
                    participants:[req.user._id,args.to],
        
        
                  })
            }else{
                newRoom=await Room.findById(args.roomId)
                
            }
         
         const newMessage=new Message({
            from:req.user._id,
            to:args.to,
            content:args.content,
            RoomId:newRoom._id,
         }) 

         newRoom.messages.push(newMessage)
       await  newRoom.save()
       await newMessage.save()

         pubsub.publish(`NEW_MESSAGE`,{newMessage:{
          
          id:newMessage._id,
          content:args.content,
          from:req.user,
          to:user
          
        }})

       return {
       
            id:newMessage._id,
            content:args.content,
            from:req.user,
            to:user
       
       
       }


        },

       
       
      

      },
      Subscription:{

        newMessage:async(root,args,{req},info)=>{
          subscribe:()=>pubsub.asyncIterator(['NEW_MESSAGE'])

        }
      }
      
}