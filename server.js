const { port } = require("./config");
const middleware =require("./middleware")
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const {typeDefs} =require("./graphql/typeDefs") 
const {resolvers} =require("./graphql/resolvers") 
async function startApolloServer() {

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
  
    let app = express();
    server.applyMiddleware({ app });
    // set middleware
    app=middleware(app)
    await new Promise(resolve => app.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    return { server, app };
  }
module.exports={
    startApolloServer
}