const { gql } = require('apollo-server-express');

module.exports=gql`

extend type Query {
    getJobs:Jobs @isAuth
    getJob(id:String!):Job @isAuth
    getProposals:proposals @isAuth

}

extend type Mutation {
    createNewJob(
    title:String
    jobType:String
    country:String
    salary:Float
    technologies:[String],
    Descrition:String
    ):Job @isAuth


    applayToJob(
    id:String!
    ):Job @isAuth

    changeProposalSatus(
    id:String!,
    status:String!
    ):message @isAuth

}


type Job{
    id:ID
    title:String
    jobType:String
    country:String
    salary:Float
    technologies:[String]
    creator:User
    candidates:[ID]
    status:String,
    Descrition:String
    createdAt:String,
    canApplay:Boolean
}


type Jobs{
    jobs:[Job]
}

type Proposal{
    id:ID
    job_id:Job,
    applicant:User,
    Comment:String,
    file_uri:String

}
type proposals{
    proposals:[Proposal]
}



`

