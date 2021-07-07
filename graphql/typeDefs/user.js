const { gql } = require('apollo-server-express');

module.exports=gql`
extend type Query {
    profile:User @isAuth
    users:[User!]!
    getNewToken(refreshToken:String!):Auth!
  
    logout(token:String!):String

}

extend type Mutation {
    register(
        name:String!
        password:String!
        email:String!
        act:String!
    ):Auth
    login(
        email:String!,
        password:String!

    ):Auth!

}

type User{
    id:ID!
    name:String!
    email:String!
    photo:String!
    act:String!
    emailVerfied:Boolean!
}

type Auth{
    user:User!
    token:String!
    refreshToken:String!
}




`

