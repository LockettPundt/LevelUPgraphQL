const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language')
const {movies, actors}  = require('../data/movieData');
const Movie = require('../models/MovieSchema');

const resolvers = {
  Query: {
    movies: async () => {
      const movieList = await Movie.find();
      return movieList;
    },
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
      const actorProfiles = actors.filter(actor => {
        return objActors.includes(actor.id);
      });
      return actorProfiles;
    }
  },
  
  Mutation: {
    addMovie: (obj, { movie }, context) => {
      const { userId } = context;
      console.log("checking to see if user has been authorized in the Mutation Query.", userId);
      // checks context to see if a valid user.
      if (userId) {
        const newMovie = Movie.create({
          ...movie
        });
        return [newMovie]
      }
      return movies;
    },
    
    updateStatus: async (obj, arg, context) => {
      // context can also be destructured in the argument list.
      const { status, id } = arg;
      const { userId } = context;
      if (userId) {
        
        const movieToUpdate = await Movie.updateOne({_id: id}, { status: status });
        const movieById = await Movie.findOne({_id: id});
        console.log( `updating status of ${movieById.title} to ${status}`);
        return movieById;
      }
      return 'sorry charlie';
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