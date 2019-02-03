import React, { Component } from 'react';

import Backdrop from '../components/backdrop/Backdrop';
import Modal from '../components/modal/Modal';
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

    this.fetchEvents = this.fetchEvents.bind(this);
    this.modalCancelHandler = this.modalCancelHandler.bind(this);
    this.modalConfirmHandler = this.modalConfirmHandler.bind(this);
    this.startCreateEventHandler = this.startCreateEventHandler.bind(this);
  }

  state = {
    creating: false,
    events: []
  };

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents() {
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
        }
      `
    };

    fetch('http://localhost:8000/graphql?query', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed');
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        this.setState({ events });
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }

  startCreateEventHandler() {
    this.setState({ creating: true });
  }

  modalCancelHandler() {
    this.setState({ creating: false });
  }

  modalConfirmHandler() {
    this.setState({ creating: false });
    const title = this.titleEl.current.value;
    const price = +this.priceEl.current.value;
    const date = this.dateEl.current.value;
    const description = this.descriptionEl.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
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
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.fetchEvents();
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }

  render() {
    const eventsList = this.state.events.map(event => (
      <li key={event._id} className="events__list-item">{event.title}</li>
    ));

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
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
          </button>
          </div>
        )}
        <ul className="events__list">
          {eventsList}
        </ul>
      </React.Fragment>
    );
  }
}

export default EventsPage;
