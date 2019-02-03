import React from 'react';
import PropTypes from 'prop-types';

import './Modal.css';

export const Modal = props => (
  <div className="modal">
    <header className="modal__header"><h1>{props.title}</h1></header>
    <section className="modal__content">
      {props.children}
    </section>
    <section className="modal__actions">
      {props.canCancel && <button className="btn" onClick={props.onCancel}>Cancel</button>}
      {props.canConfirm && <button className="btn" onClick={props.onConfirm}>Confirm</button>}
    </section>
  </div>
);

Modal.propTypes = {
  canCancel: PropTypes.bool,
  canConfirm: PropTypes.bool,
  children: PropTypes.node,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  title: PropTypes.string
};

Modal.defaultProps = {
  canCancel: true,
  canConfirm: true
};
export default Modal;
