const { GraphQLScalarType } = require('graphql');
const { PubSub } = require('apollo-server-express');
const { Kind } = require('graphql/language')
const {movies, actors}  = require('../data/movieData');
const Movie = require('../models/MovieSchema');
const MOVIE_ADDED = require('../sub_types/subTypes');

const pubsub = new PubSub();


const resolvers = {
  Subscription: {
    movieAdded: {
      subscribe: () => pubsub.asyncIterator([MOVIE_ADDED])
    }
  },
  Query: {
    movies: async () => {
      try {
        const movieList = await Movie.find();
        return movieList;
      } catch (error) {
        console.log(error);
        return [];
      }
      
    },
    movie: async(obj, arg, context, info) => {
      const { id } = arg;
      try {
        const singleMovie = await Movie.findOne({_id: id });
        return singleMovie;
      } catch (error) {
        console.log(error);
        return [];
      }
    }
  },
  Movie: {
    actors: (obj, arg, context) => {
      console.log("actors", obj.actors);
      const objActors = obj.actors.map(actor => actor.id);
      const actorProfiles = actors.filter(actor => {
        return objActors.includes(actor.id);
      });
      return actorProfiles;
    }
  },
  
  Mutation: {
    addMovie: async (obj, { movie }, context) => {
      const { userId, name } = context;
      console.log(`checking to see if ${name} has been authorized in the Mutation Query.`, userId);
      // checks context to see if a valid user.
      
      try {
        if (userId) {
        
          const newMovie = await Movie.create({
            ...movie
          });
          pubsub.publish(MOVIE_ADDED, { movieAdded: newMovie });
          return [newMovie]
        }
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    
    updateStatus: async (obj, arg, context) => {
      // context can also be destructured in the argument list.
      const { status, id } = arg;
      const { userId } = context;
      try {
        if (userId) {
          const movieToUpdate = await Movie.updateOne({_id: id}, { status: status });
          const movieById = await Movie.findOne({_id: id});
          console.log( `updating status of ${movieById.title} to ${status}`);
          return movieById;
        }
      } catch (error) {
        console.log(error);
        return [];
      }
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

module.exports = resolvers;