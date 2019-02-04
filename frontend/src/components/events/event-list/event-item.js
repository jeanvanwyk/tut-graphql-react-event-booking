import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './event-item.css';

export class EventItem extends Component {
  constructor(props) {
    super(props);

    this.onDetail = props.onDetail.bind(this, props.eventId);
  }

  render() {
    return (
      <li className="event__list-item" key={this.props.eventId}>
        <div>
          <h1>{this.props.title}</h1>
          <h2>
            ${this.props.price} - {new Date(this.props.date).toLocaleDateString()}
          </h2>
        </div>
        <div>
          {this.props.userId !== this.props.creatorId ? (
            <button className="btn" onClick={this.onDetail}>
              View Details
            </button>
          ) : (
            <p>Your the owner of this event</p>
          )}
        </div>
      </li>
    );
  }
}

EventItem.propTypes = {
  creatorId: PropTypes.string,
  date: PropTypes.string,
  eventId: PropTypes.string,
  onDetail: PropTypes.func,
  price: PropTypes.number,
  title: PropTypes.string,
  userId: PropTypes.string
};

export default EventItem;
