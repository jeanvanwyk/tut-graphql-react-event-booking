const bcrypt = require('bcryptjs');

const User = require('../../models/user');
const { transformUser } = require('./util');

const createUser = async args => {
  try {
    const existingUser = await User.findOne({ email: args.userInput.email });
    if (existingUser) {
      throw new Error('User exists already!');
    }
    const hashedPassword = bcrypt.hash(args.userInput.password, 12);
    const newUser = new User({
      email: args.userInput.email,
      password: hashedPassword
    });
    const result = await newUser.save();
    return transformUser(result);
  } catch (err) {
    throw err;
  }
};

const users = async () => {
  try {
    const users = await User.find();
    return users.map(user => {
      return transformUser(user);
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createUser,
  users
};
