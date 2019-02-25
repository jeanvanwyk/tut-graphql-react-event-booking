import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';

import Backdrop from '../components/backdrop/backdrop';
import Modal from '../components/modal/modal';
import EventList from '../components/events/event-list/event-list';
import Spinner from '../components/spinner/spinner';
import AuthContext from '../context/auth-context';

import { GET_BOOKINGS } from './bookings';

import './events.css';

const EVENT_FRAGMENT = gql`
  fragment EventFragment on Event {
    _id
    title
    description
    price
    date
  }
`;

const GET_EVENTS = gql`
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

const GET_EVENT = gql`
  query GETEVENT($eventId: String!) {
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

const CREATE_EVENT = gql`
  mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
    createEvent(eventInput: { title: $title, description: $description, price: $price, date: $date }) {
      ...EventFragment
    }
  }
  ${EVENT_FRAGMENT}
`;

const BOOK_EVENT = gql`
  mutation BookEvent($eventId: ID!) {
    bookEvent(eventId: $eventId) {
      _id
      createdAt
      updatedAt
    }
  }
`;

export class EventsPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.titleEl = React.createRef();
    this.priceEl = React.createRef();
    this.dateEl = React.createRef();
    this.descriptionEl = React.createRef();

    this.bookEventHandler = this.bookEventHandler.bind(this);
    this.modalCancelHandler = this.modalCancelHandler.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.renderCreateEventForm = this.renderCreateEventForm.bind(this);
    this.renderEventDetails = this.renderEventDetails.bind(this);
    this.showDetailHandler = this.showDetailHandler.bind(this);
    this.startCreateEventHandler = this.startCreateEventHandler.bind(this);
  }

  state = {
    creating: false,
    selectedEventId: null
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  isActive = true;

  bookEventHandler(bookEvent) {
    return () => {
      if (!this.context.token) {
        this.setState({ selectedEventId: null });
        return;
      }
      bookEvent({ variables: { eventId: this.state.selectedEventId } })
        .then(() => {
          this.setState({ selectedEventId: null });
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
    };
  }

  showDetailHandler(eventId) {
    this.setState({ selectedEventId: eventId });
  }

  startCreateEventHandler() {
    this.setState({ creating: true });
  }

  modalCancelHandler() {
    this.setState({ creating: false, selectedEventId: null });
  }

  createEvent(createEvent) {
    return () => {
      const title = this.titleEl.current.value;
      const price = +this.priceEl.current.value;
      const date = this.dateEl.current.value;
      const description = this.descriptionEl.current.value;

      if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
        return;
      }
      createEvent({ variables: { title, description, price, date } })
        .then(() => {
          this.setState({ creating: false });
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
    };
  }

  refetchEvents() {
    return [{ query: GET_EVENTS }];
  }

  refetchBookings() {
    return [{ query: GET_BOOKINGS }];
  }

  renderCreateEventForm(createEvent) {
    return (
      <React.Fragment>
        <Backdrop />
        <Modal
          onCancel={this.modalCancelHandler}
          onConfirm={this.createEvent(createEvent)}
          title="Add Event"
          canCancel
          canConfirm
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input id="title" ref={this.titleEl} type="text" />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input id="price" ref={this.priceEl} type="number" />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input id="date" ref={this.dateEl} type="datetime-local" />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" ref={this.descriptionEl} rows="4" type="text" />
            </div>
          </form>
        </Modal>
      </React.Fragment>
    );
  }

  renderEventDetails(bookEvent) {
    return (
      <Query query={GET_EVENT} variables={{ eventId: this.state.selectedEventId }}>
        {({ loading, data }) =>
          !loading ? (
            <React.Fragment>
              <Backdrop />
              <Modal
                confirmText={this.context.token ? 'Book' : 'Confirm'}
                onCancel={this.modalCancelHandler}
                onConfirm={this.bookEventHandler(bookEvent)}
                title={data.event.title}
                canCancel
                canConfirm
              >
                <h1>{data.event.title}</h1>
                <h2>
                  ${data.event.price} - {new Date(data.event.date).toLocaleDateString()}
                </h2>
                <p>{data.event.description}</p>
              </Modal>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Backdrop />
              <Modal confirmText="Loading...">
                <Spinner />
              </Modal>
            </React.Fragment>
          )
        }
      </Query>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.state.creating && (
          <Mutation mutation={CREATE_EVENT} refetchQueries={this.refetchEvents}>
            {this.renderCreateEventForm}
          </Mutation>
        )}
        {this.state.selectedEventId && (
          <Mutation mutation={BOOK_EVENT} refetchQueries={this.refetchBookings}>
            {this.renderEventDetails}
          </Mutation>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        <Query query={GET_EVENTS}>
          {({ loading, data }) =>
            loading ? (
              <Spinner />
            ) : (
              <EventList authUserId={this.context.userId} events={data.events} onViewDetail={this.showDetailHandler} />
            )
          }
        </Query>
      </React.Fragment>
    );
  }
}

export default EventsPage;
