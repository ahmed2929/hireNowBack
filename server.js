const { port } = require("./config");
const middleware =require("./middleware")
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs =require("./graphql/typeDefs") 
const resolvers =require("./graphql/resolvers") 
const {schemaDirectives} =require("./graphql/directives/auth.directive")
const {isAuth,isAuthFunction} =require("./helpers/auth/auth")

const { createServer } =require('http');
const { execute, subscribe } =require('graphql');
const { SubscriptionServer } =require('subscriptions-transport-ws');
const { makeExecutableSchema } =require ('@graphql-tools/schema');


async function startApolloServer() {
  const schema = makeExecutableSchema({ typeDefs, resolvers });



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

    const httpServer = createServer(app);

    const subscriptionServer = SubscriptionServer.create({
      // This is the `schema` we just created.
      schema,
      // These are imported from `graphql`.
      execute,
      subscribe,

      async onConnect(connectionParams, webSocket) {
        if (connectionParams.Authorization) {
          //console.log(`Authenticated websocket connection from ${connectionParams.Authorization}`);
          //const currentUser = await findUser(connectionParams.authorization);
          //return { currentUser };
         // console.debug("connectionParams.authorization,",connectionParams.Authorization)
          //const currentUser = await isAuth(connectionParams.Authorization)
         // console.debug("req", isAuth,user)
         const currentUser = await isAuthFunction(connectionParams.Authorization);

         if(!currentUser){
          throw new Error('UNAUTHINTICATED');
         }


          return { currentUser };



        }
        throw new Error('Missing auth token!');
      }




   }, {
      // This is the `httpServer` we created in a previous step.
      server: httpServer,
      // This `server` is the instance returned from `new ApolloServer`.
      path: server.graphqlPath,
   });
   
   // Shut down in the case of interrupt and termination signals
   // We expect to handle this more cleanly in the future. See (#5074)[https://github.com/apollographql/apollo-server/issues/5074] for reference.
   ['SIGINT', 'SIGTERM'].forEach(signal => {
     process.on(signal, () => subscriptionServer.close());
   });
   
   

    await new Promise(resolve => httpServer.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    app=middleware(app)
    return { server, app };
  }
module.exports={
    startApolloServer
}