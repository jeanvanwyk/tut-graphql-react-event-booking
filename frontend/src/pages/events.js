import React, { Component } from 'react';

import Backdrop from '../components/backdrop/backdrop';
import Modal from '../components/modal/modal';
import EventList from '../components/events/event-list/event-list';
import Spinner from '../components/spinner/spinner';
import AuthContext from '../context/auth-context';

import './events.css';

export class EventsPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.titleEl = React.createRef();
    this.priceEl = React.createRef();
    this.dateEl = React.createRef();
    this.descriptionEl = React.createRef();

    this.bookEventHandler = this.bookEventHandler.bind(this);
    this.fetchEvents = this.fetchEvents.bind(this);
    this.modalCancelHandler = this.modalCancelHandler.bind(this);
    this.modalConfirmHandler = this.modalConfirmHandler.bind(this);
    this.showDetailHandler = this.showDetailHandler.bind(this);
    this.startCreateEventHandler = this.startCreateEventHandler.bind(this);
  }

  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  };

  componentDidMount() {
    this.fetchEvents();
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  isActive = true;

  bookEventHandler() {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }
    const requestBody = {
      query: `
        mutation BookEvent($eventId: ID!) {
          bookEvent(eventId: $eventId) {
            _id
            createdAt
            updatedAt
          }
        }`,
      variables: {
        eventId: this.state.selectedEvent._id
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
        this.setState({ selectedEvent: null });
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }

  fetchEvents() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
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
            }
          }
        }`
    };

    fetch('http://localhost:8000/graphql?query', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed');
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        if (this.isActive) {
          this.setState({ events, isLoading: false });
        }
      })
      .catch(err => {
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }

  showDetailHandler(eventId) {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(event => event._id === eventId);
      return { selectedEvent };
    });
  }

  startCreateEventHandler() {
    this.setState({ creating: true });
  }

  modalCancelHandler() {
    this.setState({ creating: false, selectedEvent: null });
  }

  modalConfirmHandler() {
    const title = this.titleEl.current.value;
    const price = +this.priceEl.current.value;
    const date = this.dateEl.current.value;
    const description = this.descriptionEl.current.value;

    if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
      return;
    }
    const requestBody = {
      query: `
        mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
          createEvent(eventInput: { title: $title, description: $description, price: $price, date: $date }) {
            _id
            title
            description
            price
            date
          }
        }`,
      variables: {
        title,
        description,
        price,
        date
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
      .then(resData => {
        this.setState(prevState => {
          const updatedEvents = [
            ...prevState.events,
            {
              _id: resData.data.createEvent._id,
              title: resData.data.createEvent.title,
              description: resData.data.createEvent.description,
              price: resData.data.createEvent.price,
              date: resData.data.createEvent.date,
              creator: {
                _id: this.context.userId
              }
            }
          ];
          return { creating: false, events: updatedEvents };
        });
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.creating && (
          <React.Fragment>
            <Backdrop />
            <Modal
              onCancel={this.modalCancelHandler}
              onConfirm={this.modalConfirmHandler}
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
        )}
        {this.state.selectedEvent && (
          <React.Fragment>
            <Backdrop />
            <Modal
              confirmText={this.context.token ? 'Book' : 'Confirm'}
              onCancel={this.modalCancelHandler}
              onConfirm={this.bookEventHandler}
              title={this.state.selectedEvent.title}
              canCancel
              canConfirm
            >
              <h1>{this.state.selectedEvent.title}</h1>
              <h2>
                ${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}
              </h2>
              <p>{this.state.selectedEvent.description}</p>
            </Modal>
          </React.Fragment>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            authUserId={this.context.userId}
            events={this.state.events}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventsPage;
