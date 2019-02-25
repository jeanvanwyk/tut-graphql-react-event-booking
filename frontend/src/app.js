import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import AuthPage from './pages/auth';
import BookingsPage from './pages/bookings';
import EventsPage from './pages/events';
import MainNavigation from './components/navigation/main-navigation';
import AuthContext from './context/auth-context';

import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import './app.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.injectAuth = this.injectAuth.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    const cache = new InMemoryCache();

    const authLink = setContext(this.injectAuth);
    const link = new HttpLink({ uri: 'http://localhost:8000/graphql' });
    this.client = new ApolloClient({
      cache,
      link: authLink.concat(link)
    });
  }

  state = {
    token: null,
    tokenExpiration: null,
    userId: null
  };

  injectAuth(operation, prevContext) {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...prevContext.headers,
        Authorization: this.state.token ? `Bearer ${this.state.token}` : null
      }
    };
  }

  login(token, userId, tokenExpiration) {
    this.setState({ token, tokenExpiration, userId });
  }

  logout() {
    this.setState({ token: null, tokenExpiration: null, userId: null });
  }

  render() {
    return (
      <ApolloProvider client={this.client}>
        <BrowserRouter>
          <AuthContext.Provider
            value={{
              login: this.login,
              logout: this.logout,
              token: this.state.token,
              tokenExpiration: this.state.tokenExpiration,
              userId: this.state.userId
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
      </ApolloProvider>
    );
  }
}

export default App;
