const { AuthenticationError, UserInputError } = require('apollo-server');

const { Booking, Event } = require('../../db');
const { transformBooking, transformEvent } = require('./util');

const bookings = async (parent, args, context) => {
  if (!context.isAuth) {
    throw new AuthenticationError('Unauthenticated!');
  }
  try {
    const bookings = await Booking.findAll({ where: { userId: context.userId } });
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
    const booking = Booking.build({
      eventId: args.eventId,
      userId: context.userId
    });
    await booking.save();
    return transformBooking(booking);
  } catch (err) {
    throw err;
  }
};

const cancelBooking = async (parent, args, context) => {
  if (!context.isAuth) {
    throw new AuthenticationError('Unauthenticated!');
  }
  try {
    const booking = await Booking.findById(args.bookingId);
    if (!booking) {
      throw new UserInputError('Unknown booking');
    }
    const event = await Event.findById(booking.eventId);
    await Booking.destroy({ where: { id: args.bookingId } });
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  bookEvent,
  bookings,
  cancelBooking
};
