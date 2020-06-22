const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date
  
  enum Status {
    INTERESTED
    NOT_INTERESTED
    WATCHING
    WATCHED
  }

  type Movie {
    id: ID!
    title: String!
    releaseDate: Date
    rating: Int
    actors: [Actor]
    status: Status
  }
  
  type Actor {
    id: ID!
    name: String!
  }
  
  type Query {
    movies: [Movie],
    movie(id: ID): Movie,
  }
  
  type Mutation {
    addMovie(title: String, releaseDate: String, id: ID): [Movie]
  },
  
`;

module.exports = typeDefs;