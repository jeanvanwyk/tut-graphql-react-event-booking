import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs';

import './booking-chart.css';

const BOOKING_BUCKETS = {
  Cheap: { min: 0, max: 100 },
  Normal: { min: 100, max: 200 },
  Expensive: { min: 200, max: 300 },
  'Very Expensive': { min: 300, max: 10000000 }
};

export class BookingChart extends Component {
  render() {
    const data = {
      labels: [],
      datasets: [
        {
          fillColor: 'rgba(220,220,220,0.5)',
          strokeColor: 'rgba(220,220,220,0.8)',
          highlightFill: 'rgba(220,220,220,0.75)',
          highlightStroke: 'rgba(220,220,220,1)',
          data: []
        }
      ]
    };
    for (const bucket in BOOKING_BUCKETS) {
      const filteredBookingsCount = this.props.bookings.reduce((prev, current) => {
        if (current.event.price >= BOOKING_BUCKETS[bucket].min && current.event.price < BOOKING_BUCKETS[bucket].max) {
          return prev + 1;
        }
        return prev;
      }, 0);
      data.labels.push(bucket);
      data.datasets[0].data.push(filteredBookingsCount);
    }

    const options = {};

    return (
      <div className="booking-chart">
        <Bar data={data} height="250" options={options} width="600" />
      </div>
    );
  }
}

BookingChart.propTypes = {
  bookings: PropTypes.array
};

export default BookingChart;
