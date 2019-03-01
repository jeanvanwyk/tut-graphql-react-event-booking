const DataLoader = require('dataloader');
const { ApolloError } = require('apollo-server');
const { Op } = require('sequelize');

const { dateToString } = require('../../helpers/date');
const { Event, User } = require('../../db');

const eventLoader = new DataLoader(eventIds => {
  return populateEvents(eventIds);
});

const userLoader = new DataLoader(userIds => {
  return populateUsers(userIds);
});

const transformBooking = booking => ({
  ...booking.dataValues,
  _id: booking.id,
  event: populateEvent.bind(this, booking.eventId),
  user: populateUser.bind(this, booking.userId),
  createdAt: dateToString(booking.createdAt),
  updatedAt: dateToString(booking.updatedAt)
});

const transformEvent = event => ({
  ...event.dataValues,
  _id: event.id,
  date: dateToString(event.date),
  creator: populateUser.bind(this, event.creatorId)
});

const transformUser = user => ({
  ...user.dataValues,
  _id: user.id,
  password: null,
  createdEvents: () => eventLoader.loadMany(user.createdEvents)
});

const populateEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId);
    if (!event) {
      throw new ApolloError('Event not found');
    }
    return event;
  } catch (err) {
    throw err;
  }
};

const populateEvents = async eventIds => {
  try {
    const events = await Event.findAll({ where: { id: { [Op.in]: eventIds } } });
    events.sort((a, b) => {
      return eventIds.indexOf(a.id) - eventIds.indexOf(b.id);
    });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const populateUser = async userId => {
  try {
    const user = await userLoader.load(userId);
    if (!user) {
      throw new ApolloError('User not found');
    }
    return user;
  } catch (err) {
    throw err;
  }
};

const populateUsers = async userIds => {
  try {
    const users = await User.findAll({ where: { id: { [Op.in]: userIds } } });
    users.sort((a, b) => {
      return userIds.indexOf(a.id) - userIds.indexOf(b.id);
    });
    return users.map(user => {
      return transformUser(user);
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  transformBooking,
  transformEvent,
  transformUser
};
