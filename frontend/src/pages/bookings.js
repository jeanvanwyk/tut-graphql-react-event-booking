import React, { Component, Fragment } from 'react';

import BookingChart from '../components/bookings/booking-chart';
import BookingControls from '../components/bookings/booking-controls';
import BookingList from '../components/bookings/booking-list';
import Spinner from '../components/spinner/spinner';
import AuthContext from '../context/auth-context';

import './bookings.css';

export class BookingsPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.fetchBookings = this.fetchBookings.bind(this);
    this.deleteBookingHandler = this.deleteBookingHandler.bind(this);
    this.changeOutputTypeList = this.changeOutputType.bind(this, 'list');
    this.changeOutputTypeChart = this.changeOutputType.bind(this, 'chart');
  }

  state = {
    bookings: [],
    isLoading: false,
    outputType: 'list'
  };

  componentDidMount() {
    this.fetchBookings();
  }

  deleteBookingHandler(bookingId) {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }`,
      variables: {
        id: bookingId
      }
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
      .then(() => {
        this.setState(prevState => {
          const updatedBookings = prevState.bookings.filter(booking => booking._id !== bookingId);
          return { bookings: updatedBookings, isLoading: false };
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        // eslint-disable-next-line no-console
        console.error(err);
      });
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
              price
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

  changeOutputType(outputType) {
    if (outputType === 'list') {
      this.setState({ outputType: 'list' });
    } else {
      this.setState({ outputType: 'chart' });
    }
  }

  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <Fragment>
          <BookingControls
            activeOutputType={this.state.outputType}
            changeOutputTypeChart={this.changeOutputTypeChart}
            changeOutputTypeList={this.changeOutputTypeList}
          />
          <div>
            {this.state.outputType === 'list' ? (
              <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler} />
            ) : (
              <BookingChart bookings={this.state.bookings} />
            )}
          </div>
        </Fragment>
      );
    }
    return <Fragment>{content}</Fragment>;
  }
}

export default BookingsPage;
