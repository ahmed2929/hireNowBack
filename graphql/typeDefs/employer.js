const { gql } = require('apollo-server-express');

module.exports=gql`


extend type Mutation {
    createNewJob(
    title:String!
    jobType:String!
    country:String!
    salary:Float!
    technologies:[String]!
    ):Job @isAuth
 

}

type Job{
    id:ID
    title:String
    jobType:String
    country:String
    salary:Float
    technologies:[String]
    creator:ID
    candidates:[ID]
    status:String
}






`

