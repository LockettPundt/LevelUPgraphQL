const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');


const app = express();

const typeDefs = gql`

  type Movie {
    title: String
    releaseDate: String
    rating: Int
  }
  
  type Query {
    movies: [Movie],
  }
`;

const movies = [
  {
    title: "5 deadly Venoms",
    releaseDate: "10/10/1983",
    rating: 5
  },
  {
    title: "another movie",
    releaseDate: "1/08/1976",
    rating: 3
  },
];

const resolvers = {
  Query: {
    movies: () => movies,
  },
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen(5000, () => console.log('connected:  http://localhost:5000/graphql'));