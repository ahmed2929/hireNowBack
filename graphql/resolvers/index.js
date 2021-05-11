// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        freelancers: () => [{name:"ahmed",email:"re",photo:"ss",emailVerfied:false}],
    },
  };
module.exports={
    resolvers
}  