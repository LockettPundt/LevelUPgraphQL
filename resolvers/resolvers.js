const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language')
const {movies, actors}  = require('../data/movieData');

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
    addMovie: (obj, { movie }, context) => {
      const { userId } = context;
      console.log("checking to see if user has been authorized in the Mutation Query.", userId);
      // checks context to see if a valid user.
      if (userId) {
        const newMovieList = [
          ...movies,
          movie,
        ]
        console.log("new list", newMovieList)
        return newMovieList;
      }
      return movies;
    },
    
    updateStatus: (obj, { status, id }, context) => {
      // context can also be destructured in the argument list.
      const { userId } = context;
      if (userId) {
        const movieToUpdate = movies.find(movie => movie.id === id);
        console.log( `updating status of ${movieToUpdate.title} to ${status}`);
        movieToUpdate.status = status;
        return movieToUpdate;
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