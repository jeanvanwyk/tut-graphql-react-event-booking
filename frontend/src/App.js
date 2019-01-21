import React, { Component, Fragment } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import AuthPage from "./pages/auth";
import BookingsPage from "./pages/bookings";
import EventsPage from "./pages/events";
import MainNavigation from "./components/MainNavigation";

import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <MainNavigation />
          <main className="main-content">
            <Switch>
              <Redirect from="/" to="/auth" exact />
              <Route component={AuthPage} path="/auth" />
              <Route component={BookingsPage} path="/bookings" />
              <Route component={EventsPage} path="/events" />
            </Switch>
          </main>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
