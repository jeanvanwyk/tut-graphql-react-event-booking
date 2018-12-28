const Event = require("../../models/event");
const User = require("../../models/user");
const { mapEvent } = require("./util");

const events = async () => {
  try {
    const events = await Event.find();
    return events.map(event => {
      return mapEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const createEvent = async args => {
  const event = new Event({
    title: args.eventInput.title,
    description: args.eventInput.description,
    price: +args.eventInput.price,
    date: new Date(args.eventInput.date),
    creator: "5c1f3c5922f748dbecb28be4"
  });
  try {
    const result = await event.save();
    const createdEvent = mapEvent(result);
    const creator = await User.findById("5c1f3c5922f748dbecb28be4");
    if (!creator) {
      throw new Error("User not found!");
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
  events
};
