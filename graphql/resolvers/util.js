const { dateToString } = require('../../helpers/date');
const Event = require('../../models/event');
const User = require('../../models/user');

const transformBooking = booking => ({
  ...booking._doc,
  _id: booking.id,
  event: populateEvent.bind(this, booking.event),
  user: populateUser.bind(this, booking.user),
  createdAt: dateToString(booking.createdAt),
  updatedAt: dateToString(booking.updatedAt)
});

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event.date),
    creator: populateUser.bind(this, event.creator)
  };
};

const transformUser = user => {
  return {
    ...user._doc,
    _id: user.id,
    createdEvents: populateEvents.bind(this, user.createdEvents)
  };
};

const populateEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};

const populateEvents = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const populateUser = async userId => {
  try {
    const user = await User.findById(userId);
    return transformUser(user);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  transformBooking,
  transformEvent,
  transformUser
};
