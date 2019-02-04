import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './booking-item.css';

export class BookingItem extends Component {
  constructor(props) {
    super(props);

    this.onDelete = props.onDelete.bind(this, props.bookingId);
  }

  render() {
    return (
      <li className="booking__list-item">
        <div className="bookings__item-data">
          {this.props.title} - {new Date(this.props.createdAt).toLocaleDateString()}
        </div>
        <div className="booking__item-action">
          <button className="btn" onClick={this.onDelete}>
            Cancel
          </button>
        </div>
      </li>
    );
  }
}

BookingItem.propTypes = {
  bookingId: PropTypes.string,
  createdAt: PropTypes.string,
  onDelete: PropTypes.func,
  title: PropTypes.string
};

export default BookingItem;
