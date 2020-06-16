const { gql } = require('apollo-server-express');

const typeDefs = gql`
  
  enum Status {
    INTERESTED
    NOT_INTERESTED
    WATCHING
    WATCHED
  }

  type Movie {
    id: ID!
    title: String!
    releaseDate: String
    rating: Int
    actor: [Actor]
    status: Status
  }
  
  type Actor {
    id: ID!
    name: String!
  }
  
  type Query {
    movies: [Movie],
  }
`;

module.exports = typeDefs;