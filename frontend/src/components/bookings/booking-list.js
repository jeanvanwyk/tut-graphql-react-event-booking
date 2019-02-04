import React from 'react';
import PropTypes from 'prop-types';

import BookingItem from './booking-item';

import './booking-list.css';

export const BookingList = props => (
  <ul className="booking__list">
    {props.bookings.map(booking => (
      <BookingItem
        bookingId={booking._id}
        createdAt={booking.createdAt}
        key={booking._id}
        onDelete={props.onDelete}
        title={booking.event.title}
      />
    ))}
  </ul>
);

BookingList.propTypes = {
  bookings: PropTypes.array,
  onDelete: PropTypes.func
};

export default BookingList;
