const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError, UserInputError } = require('apollo-server');

const User = require('../../models/user');
const { transformUser } = require('./util');

const createUser = async (parent, args) => {
  try {
    const existingUser = await User.findOne({ email: args.userInput.email });
    if (existingUser) {
      throw new UserInputError('User exists already!');
    }
    const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
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

const users = async (parent, args, context) => {
  if (!context.isAuth) {
    throw new AuthenticationError('Unauthenticated!');
  }
  throw new ForbiddenError('Debug only function!');
  // try {
  //   const users = await User.find();
  //   return users.map(user => {
  //     return transformUser(user);
  //   });
  // } catch (err) {
  //   throw err;
  // }
};

const login = async (parent, args) => {
  const { email, password } = args;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Security - information leakage
      throw new UserInputError('User does not exist!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      // Security - information leakage
      throw new UserInputError('User password incorrect!');
    }
    const payload = { userId: user.id, email: user.email };
    const secret = 'somesupersecretkey';
    const options = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);

    return {
      userId: user.id,
      token,
      tokenExpiration: 1
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createUser,
  login,
  users
};
