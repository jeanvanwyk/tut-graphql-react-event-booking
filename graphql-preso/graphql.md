---
presentation:
  # presentation theme
  # === available themes ===
  # "beige.css"
  # "black.css"
  # "blood.css"
  # "league.css"
  # "moon.css"
  # "night.css"
  # "serif.css"
  # "simple.css"
  # "sky.css"
  # "solarized.css"
  # "white.css"
  # "none.css"
  theme: white.css

  # The "normal" size of the presentation, aspect ratio will be preserved
  # when the presentation is scaled to fit different resolutions. Can be
  # specified using percentage units.
  width: 1024
  height: 768

  # Factor of the display size that should remain empty around the content
  margin: 0.1

  # Bounds for smallest/largest possible scale to apply to content
  minScale: 0.2
  maxScale: 1.5

  # Display controls in the bottom right corner
  controls: false

  # Display a presentation progress bar
  progress: true

  # Push each slide change to the browser history
  history: true

  # Enable keyboard shortcuts for navigation
  keyboard: true

  # Enable the slide overview mode
  overview: true

  # Vertical centering of slides
  center: true

  # Enables touch navigation on devices with touch input
  touch: true

  # Flags if we should show a help overlay when the questionmark
  # key is pressed
  help: true

  # Enable slide navigation via mouse wheel
  mouseWheel: false

  # Hides the address bar on mobile devices
  hideAddressBar: true

  # Number of slides away from the current that are visible
  viewDistance: 3

  # Enable Speake Notes
  enableSpeakerNotes: true

title: Technical introduction to GraphQL
author: Jeán van wyk
date: 5 May 2019
output:
  pdf_document:
    path: graphql.pdf
    highlight: tango
custom_document:
  toc: true
  highlight: atom-dark
toc:
  depth_from: 1
  depth_to: 2
  ordered: false
---

@import "/assets/custom.css"

<!-- slide -->
# Technical intro to GraphQL
@import "/assets/graphql.svg" {width="300px" height="300px" title="GraphQL" alt="GraphQL Logo"}

<!-- slide -->
## Table of Contents
* What is GraphQL
* GraphQL core concepts
* GraphQL (query language)
* Client side
* Server side
* Thoughts & Questions
* Resources

<!-- slide data-notes="GraphQL isn't tied to any specific database or storage engine" -->
# What is GraphQL
> GraphQL is a query language for your API, and a server-side runtime for executing queries by using a type system you define for your data. GraphQL isn't tied to any specific database or storage engine and is instead backed by your existing code and data

<!-- slide -->
## The basic idea

@import "/assets/graphql-rest.jpg" {title="REST vs GraphQL" alt="REST vs GraphQL"}

<!-- slide data-notes="<b>Hierarchical:</b> A GraphQL query is a hierarchical set of fields. The query is shaped just like the data it returns.
<b>Product-centric:</b> Driven by the front-end engineers.
<b>Client-specified queries:</b> Queries are encoded in the client rather than the server. A GraphQL query returns exactly what a client asks for and no more.
<b>Backwards Compatible:</b> Facebook releases apps on a two week fixed cycle with 2 year maintenance. Minimum 52 versions of our clients per platform querying our servers at any given time. Simplifies managing our backwards compatibility guarantees.
<b>Structured, Arbitrary Code:</b> GraphQL imposes a structure onto a server. Server-side flexibility, uniform, powerful API .
<b>Application-Layer Protocol:</b> Application-layer protocol. It is a string that is parsed and interpreted by a server.
<b>Strongly-typed:</b> GraphQL is strongly-typed. Tooling can ensure that the query is both syntactically correct and valid before execution, i.e. at development time, and the server can make certain guarantees about the shape and nature of the response. This makes it easier to build high quality client tools.
<b>Introspective:</b> GraphQL is introspective. Clients and tools can query the type system using the GraphQL syntax itself. This is a powerful platform for building tools and client software. Benefits Swift, Objective-C and Java: Untyped JSON -> strongly-typed business objects." -->
## Design principles
* Hierarchical
* Product-centric
* Client-specified queries
* Backwards Compatible
* Structured, Arbitrary Code
* Strongly-typed
* Application-Layer Protocol
* Introspective

<!-- slide -->
### Palet cleanser
@import "/assets/calvin-hobbes-fish.gif" {width="90%" title="Calvin fishing" alt="Calvin fishing"}

<!-- slide -->
# Core concepts
* Schema (Server side)
  * Type definitions
  * Query definitions
  * Mutation definitions
* Variables (Client side)
* Fragments (Client side)
* Resolvers (Server side)

<!-- slide -->
## Type definitions
GraphQL is typesafe so each field has a type

```GraphQL
type Booking {
  _id: ID!
  event: Event!
  user: User!
  createdAt: String!
  updatedAt: String!
}

type Event {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: User!
}

type User {
  _id: ID!
  email: String!
  password: String
  createdEvents: [Event!]
}
```

<!-- slide -->
### .. Types, Inputs
```GraphQL
type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

input EventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
}

input UserInput {
  email: String!
  password: String!
}
```

<!-- slide -->
### ... Enums, Interfaces and Unions
```GraphQL
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}
type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}
type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}
union SearchResult = Human | Droid | Starship
```

<!-- slide -->
## Query definitions

```GraphQL
type Query {
  bookings: [Booking!]!
  event(eventId: String!): Event
  events: [Event!]!
  users: [User!]!
  login(email: String!, password: String!): AuthData!
}
```
<!-- slide -->
## Mutation definitions

```GraphQL
type Mutation {
  createEvent(eventInput: EventInput): Event
  createUser(userInput: UserInput): User
  bookEvent(eventId: ID!): Booking!
  cancelBooking(bookingId: ID!): Event!
}
```

<!-- slide -->
# Show me the GraphQL!
[GraphiQL](http://localhost:8000/graphql) or [Playground](http://localhost:8001/graphql)
@import "/assets/interest.jpg" {title="Interest" alt="Interest"}

<!-- slide -->
## Variables
### Example query
```JavaScript
const GET_EVENT = `
  query {
    event(eventId: ${eventId}) {
      _id title description price date
      creator { _id email }
    }
  }`;
fetch('http://localhost:8000/graphql?query', {
  method: 'POST',
  body: JSON.stringify({ query: GET_EVENT }),
  ...
})
```

<!-- slide -->
### Using Variables
```JavaScript
const GET_EVENT = `
  query GetEvent($eventId: String!) {
    event(eventId: $eventId) {
      _id title description price date
      creator { _id email }
    }
  }`;
  fetch('http://localhost:8000/graphql?query', {
    method: 'POST',
    body: JSON.stringify({ 
      query: GET_EVENT,
      variables: { eventId }
    }),
    ...
  })
```
<!-- slide -->
## Fragments
### Example queries
```JavaScript
const GET_EVENTS = `
  query {
    events {
      _id
      title
      description
      price
      date
      creator {
        _id
        email
      }
    }
  }
`;

const GET_EVENT = `
  query GetEvent($eventId: String!) {
    event(eventId: $eventId) {
      _id
      title
      description
      price
      date
      creator {
        _id
        email
      }
    }
  }
`;
```
<!-- slide -->
### Using fragments
```JavaScript
const EVENT_FRAGMENT = `
  fragment EventFragment on Event {
    _id
    title
    description
    price
    date
  }
`;

const GET_EVENTS = `
  query {
    events {
      ...EventFragment
      creator {
        _id
        email
      }
    }
  }
  ${EVENT_FRAGMENT}
`;

const GET_EVENT = `
  query GetEvent($eventId: String!) {
    event(eventId: $eventId) {
      ...EventFragment
      creator {
        _id
        email
      }
    }
  }
  ${EVENT_FRAGMENT}
`;
```

<!-- slide -->
## Code is the spice of life
The client side
* `fetch`
* `Apollo client`
@import "/assets/xkcd-code.png" {width="90%" title="Code comments" alt="Code comments"}

<!-- slide -->
# Serve side magic
@import "/assets/magic.jpg" {height="90%" title="Magic" alt="Magic"}

<!-- slide -->
## Query Resolvers
```JavaScript
// bookings: [Booking!]!
const bookings = () => { ... };
// event(eventId: String!): Event
const event = (eventId) => { ... };
// events: [Event!]!
const events = () => { ... };
// users: [User!]!
const users = () => { ... };
// login(email: String!, password: String!): AuthData!
const login = (email, password) => { ... };
```

<!-- slide -->
## Mutation Resolvers
```JavaScript
// createEvent(eventInput: EventInput): Event
const createEvent = (eventInput) => { ... };
// createUser(userInput: UserInput): User
const createUser = (userInput) => { ... };
// bookEvent(eventId: ID!): Booking!
const bookEvent = (eventId) => { ... };
// cancelBooking(bookingId: ID!): Event!
const cancelBooking = (bookingId) => { ... };
```

<!-- slide -->
## "Lazy loading"
```JavaScript
const transformEvent = event => {
  ...
  return {
    _id: id,
    title,
    description,
    price,
    date: dateToString(date),
    creator: () => {...}
  };
};
```

<!-- slide -->
## Code! Code! My kindom for some code!
There are various frameworks for various languages that will help you write servers and clients.

* `express-graphql` + `mongodb`
* `Apollo server` + `sqlite`

<!-- slide -->
@import "/assets/graphql-talk.jpg" {verticalAlign="center" title="Talk" alt="Talk"}

<!-- slide -->
# Thoughts & Questions
## GraphQL problems / limitations
* The N+1 Query problem / Caching
* Performance (server side)
* Limited by server (can only ask for less)

@import "/assets/calvin-hobbes-nails.jpg" {width="90%" title="Trick question" alt="Trick question"}

<!-- slide -->
## GraphQL advantages
* Get only the data that you request
* Server side lazy loading^1^
* Client flexibility
* Reduced server development

@import "/assets/calvin-hobbes-fishing.gif" {width="90%" title="Fishing" alt="Fishing"}

<!-- slide -->
# Resources
* [Academind](https://www.youtube.com/channel/UCSJbGtTlrDami-tDGPUV9-w)
  * [GraphQL tutorial](https://www.youtube.com/watch?v=7giZGFDGnkc&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_)
* [GraphQL Introduction](https://reactjs.org/blog/2015/05/01/graphql-introduction.html)
* [graphql.org](https://graphql.org)
* [howtographql.com](https://www.howtographql.com)
* [apollographql.com](https://www.apollographql.com)
