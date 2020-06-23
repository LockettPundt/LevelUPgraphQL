const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');

const typeDefs = require('../schema/schema');
const { env } = require('process');

const resolvers = require('../resolvers/resolvers');
const app = express();


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

app.listen({port: process.env.PORT || 5000}, () => console.log('connected:  http://localhost:5000/graphql'));