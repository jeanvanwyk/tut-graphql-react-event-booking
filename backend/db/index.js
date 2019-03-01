const Sequelize = require('sequelize');

const { MONGO_USER, MONGO_PASSWORD, MONGO_DB } = process.env;

// Define the connection
const sequelize = new Sequelize(MONGO_DB, MONGO_USER, MONGO_PASSWORD, {
  dialect: 'sqlite',
  logging: false,
  storage: `${MONGO_DB}.sqlite`
});

const User = sequelize.define('user', {
  id: { primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
  email: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false }
});

const Event = sequelize.define('event', {
  id: { primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
  title: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.STRING, allowNull: false },
  price: { type: Sequelize.FLOAT, allowNull: false },
  date: { type: Sequelize.DATE, allowNull: false }
});
Event.belongsTo(User, { as: 'creator' });

const Booking = sequelize.define('bookings', {
  id: { primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 }
});
Event.hasMany(Booking);
User.hasMany(Booking);

module.exports = { Booking, Event, User, sequelize };
