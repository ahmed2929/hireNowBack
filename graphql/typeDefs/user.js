const { gql } = require('apollo-server-express');

module.exports=gql`
extend type Query {
    profile:User
    users:[User!]!
    getNewToken(refreshToken:String!):Auth!
    login(
        email:String!,
        password:String!

    ):Auth!
    logout(token:String!):String

}

extend type Mutation {
    register(
        name:String!
        password:String!
        email:String!
        act:String!
    ):Auth

}

type User{
    id:ID!
    name:String!
    email:String!
    photo:String!
}

type Auth{
    user:User
    token:String!
    refreshToken:String!
}




`

