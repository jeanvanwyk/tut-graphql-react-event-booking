const Event = require("../../models/event");
const User = require("../../models/user");

const mapBooking = booking => ({
  ...booking._doc,
  _id: booking.id,
  event: populateEvent.bind(this, booking._doc.event),
  user: populateUser.bind(this, booking._doc.user),
  createdAt: new Date(booking._doc.createdAt).toISOString(),
  updatedAt: new Date(booking._doc.updatedAt).toISOString()
});

const mapEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: new Date(event._doc.date).toISOString(),
    creator: populateUser.bind(this, event._doc.creator)
  };
};

const mapUser = user => {
  return {
    ...user._doc,
    _id: user.id,
    createdEvents: populateEvents.bind(this, user._doc.createdEvents)
  };
};

const populateEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    return mapEvent(event);
  } catch (err) {
    throw err;
  }
};

const populateEvents = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return mapEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const populateUser = async userId => {
  try {
    const user = await User.findById(userId);
    return mapUser(user);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  mapBooking,
  mapEvent,
  mapUser
};
