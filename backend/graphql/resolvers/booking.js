const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformEvent, transformBooking } = require('./util');

const bookings = async (args, req) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated!');
  }
  try {
    const bookings = await Booking.find({ user: req.userId });
    return bookings.map(booking => {
      return transformBooking(booking);
    });
  } catch (err) {
    throw err;
  }
};

const bookEvent = async (args, req) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated!');
  }
  try {
    const fetchedEvent = await Event.findById(args.eventId);
    if (!fetchedEvent) {
      throw new Error('Event does not exist');
    }
    const booking = new Booking({
      event: fetchedEvent,
      user: req.userId
    });
    const result = await booking.save();
    return transformBooking(result);
  } catch (err) {
    throw err;
  }
};

const cancelBooking = async (args, req) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated!');
  }
  try {
    const booking = await Booking.findById(args.bookingId).populate('event');
    if (!booking) {
      throw new Error('Unknown booking');
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
