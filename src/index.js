const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const {movies, actors}  = require('../data/movieData');
const typeDefs = require('../schema/schema');
const { env } = require('process');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language')
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
  Movie: {
    actors: (obj, arg, context) => {
      console.log("actors", obj.actors);
      const objActors = obj.actors.map(actor => actor.id);
      // db call or static data reference.
      const actorProfiles = actors.filter(actor => {
        return objActors.includes(actor.id);
      });
      return actorProfiles;
    }
  },
  
  Mutation: {
    addMovie: (obj, { id, releaseDate, title }, context) => {
      console.log('release date', releaseDate);
      const newMovieList = [
        ...movies,
        {
          id,
          releaseDate,
          title,
        },
      ]
      console.log("new list", newMovieList)
      return newMovieList;
    },
  },
  
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date scalar.",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      console.log(value);
      return new Date(value).getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) return new Date(ast.value)
      return null;
    }
  })
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({port: process.env.PORT || 5000}, () => console.log('connected:  http://localhost:5000/graphql'));