const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date
  
  # to create a fragment for a specific type, 
  # use this syntax in the query itself.
  
  # fragment Meta on Movie {
  # title
  # rating
  # releaseDate
  # status
  # }

  
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
  
  input ActorInput {
    id: ID
    name: String
  }
  
  input MovieInput {
    id: ID
    title: String
    releaseDate: Date
    rating: Int
    status: Status
    actors: [ActorInput]
  }
  
  type Subscription {
    movieAdded: Movie
  }
  
  type Mutation {
    addMovie(movie: MovieInput): [Movie],
    updateStatus(id: ID, status: Status): Movie,
  },
  
`;

module.exports = typeDefs;