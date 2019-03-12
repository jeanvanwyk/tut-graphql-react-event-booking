/* eslint-disable no-console */
const bodyParser = require('body-parser');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const { sequelize } = require('./db');
const { createData } = require('./db/create');

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

sequelize
  .sync()
  .then(() => {
    return createData();
  })
  .then(() => {
    app.listen({ port: 8000 }, () => console.log(`🚀 Server ready at http://localhost:8000${server.graphqlPath}`));
  })
  .catch(err => {
    console.error(err);
  });
