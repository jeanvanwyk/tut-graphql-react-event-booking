# GraphiQL

## Queries
```GraphQL
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
      createdEvents {
        _id
        title
      }
    }
  }
}
```

```GraphQL
query {
  login(email: "test1@test.com", password: "password") {
    token
    userId
  }
}
```

```GraphQL
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
      createdEvents {
        _id
        title
      }
    }
  }
},
variables: { 
  "eventId": "b57017d1-007e-45cd-b041-4fa3ad93b7cb"
}
```