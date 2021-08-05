const { gql } = require('apollo-server-express');

module.exports=gql`

extend type Query {
    getChatRooms:Rooms @isAuth
    getChat(RoomId:String!):chatMessages @isAuth
    

}

extend type Mutation {
    sendMessage(
    content:String!
    to:String!,
    roomId:String
    ):chatMessage @isAuth


  

}
type chatMessages {
messages:[chatMessage]

}

type chatMessage{
    _id:ID
    content:String,
    from:ID,
    to:ID,
    RoomId:ID,
}

type Rooms{
    ChatRoomUsers:[room]
}

type room{
    roomId:ID!,
    latestMessage:chatMessage,
    user:roomUser

}
type roomUser{
    id:ID!,
        name:String,
        photo:String,
}


extend type Subscription {
    newMessage:chatMessage @isAuth
}

`

