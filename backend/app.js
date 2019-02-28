const bodyParser = require('body-parser');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');

const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/schema');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    isAuth: req.isAuth,
    userId: req.userId
  })
});

server.applyMiddleware({ app }); // app is from an existing express app

const mongooseUrl = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@graphql-cluster-4lyvf.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`;

mongoose
  .connect(mongooseUrl)
  .then(() => {
    app.listen({ port: 8000 }, () =>
      console.log(`🚀 Server ready at http://localhost:8000${server.graphqlPath}`)
    )
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error(err);
  });
