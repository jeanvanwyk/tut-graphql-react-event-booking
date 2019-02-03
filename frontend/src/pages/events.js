import React, { Component } from 'react';

import Backdrop from '../components/backdrop/Backdrop';
import Modal from '../components/modal/Modal';

import './events.css';

export class EventsPage extends Component {
  constructor(props) {
    super(props);

    this.startCreateEventHandler = this.startCreateEventHandler.bind(this);
    this.modalCancelHandler = this.modalCancelHandler.bind(this);
    this.modalConfirmHandler = this.modalConfirmHandler.bind(this);
  }

  state = {
    creating: false,
  };

  startCreateEventHandler() {
    this.setState({ creating: true });
  }

  modalCancelHandler() {
    this.setState({ creating: false });
  }

  modalConfirmHandler() {
    this.setState({ creating: false });
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
              Modal Content
            </Modal>
          </React.Fragment>
        )}
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.startCreateEventHandler}>
            Create Event
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;
