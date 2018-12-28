const { bookEvent, bookings, cancelBooking } = require("./booking");
const { createEvent, events } = require("./event");
const { createUser, users } = require("./user");

module.exports = {
  bookEvent,
  bookings,
  cancelBooking,
  createEvent,
  createUser,
  events,
  users
};
