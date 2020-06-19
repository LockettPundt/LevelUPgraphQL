const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const movies  = require('../data/movieData');
const typeDefs = require('../schema/schema');
const { env } = require('process');
const app = express();


const resolvers = {
  Query: {
    movies: () => movies,
    movie: (obj, arg, context, info) => {
      const { id } = arg;
      return movies.find(movie => {
        return movie.id === id;
      })
    }
  },
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({port: process.env.PORT || 5000}, () => console.log('connected:  http://localhost:5000/graphql'));