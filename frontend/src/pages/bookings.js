import React, { Component } from 'react';

import Spinner from '../components/spinner/spinner';
import AuthContext from '../context/auth-context';

export class BookingsPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.fetchBookings = this.fetchBookings.bind(this);
  }

  state = {
    bookings: [],
    isLoading: false
  };

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
            }
            updatedAt
          }
        }
      `
    };
    const token = this.context.token;

    fetch('http://localhost:8000/graphql?query', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed');
        }
        return res.json();
      })
      .then(resData => {
        const bookings = resData.data.bookings;
        this.setState({ bookings, isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ?
          <Spinner /> :
          (
            <ul>
              {this.state.bookings.map(booking => (
                <li key={booking._id}>
                  {new Date(booking.createdAt).toLocaleDateString()}, {booking.event.title} -{' '}
                  {new Date(booking.event.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
      </React.Fragment>
    );
  }
}

export default BookingsPage;
