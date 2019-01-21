const {
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = require('graphql');

const Event = new GraphQLObjectType({
  name: 'Event',
  fields:  () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    date: { type: new GraphQLNonNull(GraphQLString) },
    creator: { type: new GraphQLNonNull(User) }
  })
});

const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: { type: new GraphQLNonNull(GraphQLID) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString },
    createdEvents: { type: new GraphQLList(new GraphQLNonNull(Event)) }
  }
});

const Booking = new GraphQLObjectType({
  name: 'Booking',
  fields: {
    _id: { type: new GraphQLNonNull(GraphQLID) },
    event: { type: new GraphQLNonNull(Event) },
    user: { type: new GraphQLNonNull(User) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    updatedAt: { type: new GraphQLNonNull(GraphQLString) }
  }
});

const AuthData = new GraphQLObjectType({
  name: 'AuthData',
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
    token: { type: new GraphQLNonNull(GraphQLString) },
    tokenExpiration: { type: new GraphQLNonNull(GraphQLInt) }
  }
});

const EventInput = new GraphQLInputObjectType({
  name: 'EventInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    date: { type: new GraphQLNonNull(GraphQLString) }
  }
});

const UserInput = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    bookings: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Booking))) },
    events: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Event))) },
    users: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))) },
    login: {
      type: new GraphQLNonNull(AuthData),
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      }
    }
  }
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    createEvent: {
      type: Event,
      args: {
        eventInput: { type: EventInput }
      }
    },
    createUser: {
      type: User,
      args: {
        userInput: { type: UserInput }
      }
    },
    bookEvent: {
      type: new GraphQLNonNull(Booking),
      args: {
        eventId: { type: GraphQLID }
      }
    },
    cancelBooking: {
      type: new GraphQLNonNull(Event),
      args: {
        bookingId: { type: GraphQLID }
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});

