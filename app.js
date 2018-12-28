const bodyParser = require("body-parser");
const express = require("express");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const rootValue = require("./graphql/resolvers");
const schema = require("./graphql/schema");

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
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
    app.listen(3000);
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error(err);
  });
