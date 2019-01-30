const bookingResolver = require('./booking');
const eventResolver = require('./event');
const userResolver = require('./user');

module.exports = {
  ...bookingResolver,
  ...eventResolver,
  ...userResolver
};
