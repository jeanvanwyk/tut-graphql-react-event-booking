import React from 'react';
import PropTypes from 'prop-types';

import EventItem from './event-item';

import './event-list.css';

export const EventList = props => (
  <ul className="event__list">
    {props.events.map(event => (
      <EventItem
        creatorId={event.creator._id}
        date={event.date}
        eventId={event._id}
        key={event._id}
        onDetail={props.onViewDetail}
        price={event.price}
        title={event.title}
        userId={props.authUserId}
      />
    ))}
  </ul>
);

EventList.propTypes = {
  authUserId: PropTypes.string,
  events: PropTypes.array,
  onViewDetail: PropTypes.func
};

export default EventList;
