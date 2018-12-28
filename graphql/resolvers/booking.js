const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { mapEvent, mapBooking } = require("./util");

const bookings = async () => {
  try {
    const bookings = await Booking.find();
    return bookings.map(booking => {
      return mapBooking(booking);
    });
  } catch (err) {
    throw err;
  }
};

const bookEvent = async args => {
  try {
    const fetchedEvent = await Event.findById(args.eventId);
    if (!fetchedEvent) {
      throw new Error("Event does not exist");
    }
    const booking = new Booking({
      event: fetchedEvent,
      user: "5c1f3c5922f748dbecb28be4"
    });
    const result = await booking.save();
    return mapBooking(result);
  } catch (err) {
    throw err;
  }
};

const cancelBooking = async args => {
  try {
    const booking = await Booking.findById(args.bookingId).populate("event");
    if (!booking) {
      throw new Error("Unknown booking");
    }
    const event = mapEvent(booking.event);
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
