require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const typeDefs = require('../schema/schema');
const resolvers = require('../resolvers/resolvers');

const app = express();

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME,
})
  .then(() => console.log(`🔥connected to ${process.env.DB_NAME}`))
  .catch((err) => console.log(err));


  
const httpServer = http.createServer(app);


const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => {
    // user auth can happen here.
    // returns a user object or grants access for the user
    // or you could return an error so that a user is blocked from 
    // posting a mutation.
    // here is a hardcoded user auth. 
    const fakeUserAuth = {
      userId: '12345',
      name: 'lockett',
    }
    return {
      ...fakeUserAuth,
    };
  }
});

server.applyMiddleware({ app, path: '/graphql' });
server.installSubscriptionHandlers(httpServer);
httpServer.listen({port: process.env.PORT || 5000}, () => {
  console.log('🔥connected:  http://localhost:5000/graphql')
});