const { port } = require("./config");
const middleware =require("./middleware")
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs =require("./graphql/typeDefs") 
const resolvers =require("./graphql/resolvers") 
const {schemaDirectives} =require("./graphql/directives/auth.directive")
const {isAuth} =require("./helpers/auth/auth")
async function startApolloServer() {
  let app = express();
  app.use(isAuth)
    const server = new ApolloServer({
       typeDefs,
      resolvers,
      schemaDirectives,
      context:({req})=>{
        let {isAuth,user} =req;
        return {
          isAuth,
          user,
          req
        }
      } 
      
      
      });
    await server.start();
  
    
    server.applyMiddleware({ app });
    // set middleware
    await new Promise(resolve => app.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    app=middleware(app)
    return { server, app };
  }
module.exports={
    startApolloServer
}