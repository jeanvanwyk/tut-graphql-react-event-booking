const { User, Event, Booking } = require('./index');
const bcrypt = require('bcryptjs');

// Set up some test users

const createData = async () => {
  const user = await User.findOne({ where: { email: 'test@test.com' } });
  if (!user) {
    console.log('----- CREATING DATA');
    const hashedPassword = await bcrypt.hash('password', 12);
    const user1 = User.build({
      email: 'test@test.com',
      password: hashedPassword
    });
    await user1.save();
    const user2 = User.build({
      email: 'test1@test.com',
      password: hashedPassword
    });
    await user2.save();

    const prices = [55.55, 95.99, 120.2, 180.1, 210.21, 250.5, 309.09, 399.99];
    const names1 = ['Blair', 'Ed', 'Gene', 'Luke'];
    names1.forEach(name => {
      const event = Event.build({
        title: `Testing with ${name}`,
        description: `Testing in the dark with ${name}`,
        price: prices[Math.floor(Math.random() * prices.length)],
        date: new Date(),
        creatorId: user1.id
      });
      event.save();
      const booking = Booking.build({
        eventId: event.id,
        userId: user2.id
      });
      booking.save();
    });

    const names2 = ['Josh', 'Benson', 'Rob', 'Alex'];
    names2.forEach(name => {
      const event = Event.build({
        title: `Coding with ${name}`,
        description: `An fun dya of coding with ${name}`,
        price: prices[Math.floor(Math.random() * prices.length)],
        date: new Date(),
        creatorId: user2.id
      });
      event.save();
      const booking = Booking.build({
        eventId: event.id,
        userId: user1.id
      });
      booking.save();
    });
  } else {
    console.log('----- NO DATA CREATED');
  }
};

module.exports = {
  createData
};
