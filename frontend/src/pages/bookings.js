import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query, withApollo } from 'react-apollo';

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

export const GET_BOOKINGS = gql`
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

    this.deleteBookingHandler = this.deleteBookingHandler.bind(this);
    this.changeOutputTypeList = this.changeOutputType.bind(this, 'list');
    this.changeOutputTypeChart = this.changeOutputType.bind(this, 'chart');
  }

  state = {
    bookings: [],
    outputType: 'list'
  };

  deleteBookingHandler(bookingId) {
    this.props.client
      .mutate({
        mutation: DELETE_BOOKING,
        refetchQueries: () => [{ query: GET_BOOKINGS }],
        variables: {
          id: bookingId
        }
      })
      .then(() => {
        this.setState(prevState => {
          const updatedBookings = prevState.bookings.filter(booking => booking._id !== bookingId);
          return { bookings: updatedBookings };
        });
      })
      .catch(err => {
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
    return (
      <Query query={GET_BOOKINGS}>
        {({ loading, data }) =>
          loading ? (
            <Spinner />
          ) : (
            <Fragment>
              <BookingControls
                activeOutputType={this.state.outputType}
                changeOutputTypeChart={this.changeOutputTypeChart}
                changeOutputTypeList={this.changeOutputTypeList}
              />
              <div>
                {this.state.outputType === 'list' ? (
                  <BookingList bookings={data.bookings} onDelete={this.deleteBookingHandler} />
                ) : (
                  <BookingChart bookings={data.bookings} />
                )}
              </div>
            </Fragment>
          )
        }
      </Query>
    );
  }
}

BookingsPage.propTypes = {
  client: PropTypes.object
};

export default withApollo(BookingsPage);
