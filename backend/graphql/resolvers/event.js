const { ApolloError, AuthenticationError, UserInputError } = require('apollo-server');

const { Event, User } = require('../../db');
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
    const events = await Event.findAll();
    return events.map(event => transformEvent(event));
  } catch (err) {
    throw err;
  }
};

const createEvent = async (parent, args, context) => {
  if (!context.isAuth) {
    throw new AuthenticationError('Unauthenticated!');
  }
  const event = Event.build({
    title: args.eventInput.title,
    description: args.eventInput.description,
    price: +args.eventInput.price,
    date: args.eventInput.date,
    creatorId: context.userId
  });
  try {
    await event.save();
    const createdEvent = transformEvent(event);
    const creator = await User.findById(context.userId);
    creator.createdEvents = await Event.findAll({ where: { creatorId: context.userId } });
    creator.createdEvents = creator.createdEvents.map(event => transformEvent(event));
    if (!creator) {
      throw new ApolloError('User not found!');
    }
    // creator.createdEvents.push(event);
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
