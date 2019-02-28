const { AuthenticationError, UserInputError } = require('apollo-server');

const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformEvent, transformBooking } = require('./util');

const bookings = async (parent, args, context) => {
  if (!context.isAuth) {
    throw new AuthenticationError('Unauthenticated!');
  }
  try {
    const bookings = await Booking.find({ user: context.userId });
    return bookings.map(booking => {
      return transformBooking(booking);
    });
  } catch (err) {
    throw err;
  }
};

const bookEvent = async (parent, args, context) => {
  if (!context.isAuth) {
    throw new AuthenticationError('Unauthenticated!');
  }
  try {
    const fetchedEvent = await Event.findById(args.eventId);
    if (!fetchedEvent) {
      throw new UserInputError('Event does not exist');
    }
    const booking = new Booking({
      event: fetchedEvent,
      user: context.userId
    });
    const result = await booking.save();
    return transformBooking(result);
  } catch (err) {
    throw err;
  }
};

const cancelBooking = async (parent, args, context) => {
  if (!context.isAuth) {
    throw new AuthenticationError('Unauthenticated!');
  }
  try {
    const booking = await Booking.findById(args.bookingId).populate('event');
    if (!booking) {
      throw new UserInputError('Unknown booking');
    }
    const event = transformEvent(booking.event);
    await Booking.deleteOne({ _id: args.bookingId });
    return event;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  bookEvent,
  bookings,
  cancelBooking
};
