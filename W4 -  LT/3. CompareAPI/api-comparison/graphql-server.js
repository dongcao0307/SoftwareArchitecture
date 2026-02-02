const { ApolloServer, gql } = require('apollo-server');
const books = require('./data');

const typeDefs = gql`
  type Book { id: ID, title: String, author: String, price: Int }
  type Query { book(id: ID!): Book }
`;

const resolvers = {
  Query: { book: (_, { id }) => books.find(b => b.id === id) }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen(4000).then(({ url }) => console.log(`✅ GraphQL Server: ${url}`));