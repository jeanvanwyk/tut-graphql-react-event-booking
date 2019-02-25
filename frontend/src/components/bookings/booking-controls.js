import React from 'react';
import PropTypes from 'prop-types';

import './booking-controls.css';

export const BookingControls = props => (
  <div className="booking-controls">
    <button className={props.activeOutputType === 'list' ? 'active' : ''} onClick={props.changeOutputTypeList}>
      List
    </button>
    <button className={props.activeOutputType === 'chart' ? 'active' : ''} onClick={props.changeOutputTypeChart}>
      Chart
    </button>
  </div>
);

BookingControls.propTypes = {
  activeOutputType: PropTypes.string,
  changeOutputTypeChart: PropTypes.func,
  changeOutputTypeList: PropTypes.func
};

export default BookingControls;
