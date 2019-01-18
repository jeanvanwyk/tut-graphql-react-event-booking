import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import AuthPage from './pages/auth';
import BookingsPage from './pages/bookings';
import EventsPage from './pages/events';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Redirect from="/" to="/auth" exact />
          <Route component={AuthPage} path="/auth" />
          <Route component={BookingsPage} path="/bookings" />
          <Route component={EventsPage} path="/events" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
