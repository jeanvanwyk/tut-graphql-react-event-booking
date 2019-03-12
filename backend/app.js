/* eslint-disable no-console */
const bodyParser = require('body-parser');
const express = require('express');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const rootValue = require('./graphql/resolvers');
const schema = require('./graphql/schema');
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

app.use(
  '/graphql',
  graphqlHttp({
    schema,
    rootValue,
    graphiql: true
  })
);
const mongooseUrl = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@graphql-cluster-4lyvf.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`;

mongoose
  .connect(mongooseUrl)
  .then(() => {
    app.listen(8000, () => console.log('🚀 Server ready at http://localhost:8000/graphql'));
  })
  .catch(err => {
    console.error(err);
  });
