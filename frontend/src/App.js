import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import AuthPage from './pages/auth';
import BookingsPage from './pages/bookings';
import EventsPage from './pages/events';
import MainNavigation from './components/navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  state = {
    token: null,
    tokenExpiration: null,
    userId: null,
  };

  login(token, userId, tokenExpiration) {
    this.setState({ token, tokenExpiration, userId });
  }

  logout() {
    this.setState({ token: null, tokenExpiration: null, userId: null });
  }

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            login: this.login,
            logout: this.logout,
            token: this.state.token,
            tokenExpiration: this.state.tokenExpiration,
            userId: this.state.userId,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {this.state.token && <Redirect from="/" to="/events" exact />}
              {this.state.token && <Redirect from="/auth" to="/events" exact />}
              {!this.state.token && <Route component={AuthPage} path="/auth" />}
              <Route component={EventsPage} path="/events" />
              {this.state.token && <Route component={BookingsPage} path="/bookings" />}
              {!this.state.token && <Redirect to="/auth" exact />}
             </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
