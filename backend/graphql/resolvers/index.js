const bookingResolver = require('./booking');
const eventResolver = require('./event');
const userResolver = require('./user');

module.exports = {
  RootQuery: {
    bookings: bookingResolver.bookings,
    event: eventResolver.event,
    events: eventResolver.events,
    users: userResolver.users,
    login: userResolver.login
  },
  RootMutation: {
    createEvent: eventResolver.createEvent,
    createUser: userResolver.createUser,
    bookEvent: bookingResolver.bookEvent,
    cancelBooking: bookingResolver.cancelBooking
  }
};
