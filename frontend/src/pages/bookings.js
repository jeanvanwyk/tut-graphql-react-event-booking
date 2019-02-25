import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

import BookingChart from '../components/bookings/booking-chart';
import BookingControls from '../components/bookings/booking-controls';
import BookingList from '../components/bookings/booking-list';
import Spinner from '../components/spinner/spinner';
import AuthContext from '../context/auth-context';

import './bookings.css';

const DELETE_BOOKING = gql`
  mutation CancelBooking($id: ID!) {
    cancelBooking(bookingId: $id) {
      _id
      title
    }
  }
`;

const GET_BOOKINGS = gql`
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
`;

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
    this.props.client
      .mutate({
        mutation: DELETE_BOOKING,
        variables: {
          id: bookingId
        }
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
    this.props.client
      .query({
        query: GET_BOOKINGS
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

BookingsPage.propTypes = {
  client: PropTypes.object
};

export default withApollo(BookingsPage);
