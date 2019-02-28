const { AuthenticationError, UserInputError } = require('apollo-server');

const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./util');

const event = async (parent, args) => {
  try {
    const event = await Event.findById(args.eventId);
    if (!event) {
      throw new UserInputError('Unknown event!');
    }
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};

const events = async () => {
  try {
    const events = await Event.find();
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const createEvent = async (parent, args, context) => {
  if (!context.isAuth) {
    throw new AuthenticationError('Unauthenticated!');
  }
  const event = new Event({
    title: args.eventInput.title,
    description: args.eventInput.description,
    price: +args.eventInput.price,
    date: new Date(args.eventInput.date),
    creator: context.userId
  });
  try {
    const result = await event.save();
    const createdEvent = transformEvent(result);
    const creator = await User.findById(context.userId);
    if (!creator) {
      throw new Error('User not found!');
    }
    creator.createdEvents.push(event);
    await creator.save();
    return createdEvent;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createEvent,
  event,
  events
};
