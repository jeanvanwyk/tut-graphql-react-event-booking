import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withApollo } from 'react-apollo';

import AuthContext from '../../context/auth-context';

import './main-navigation.css';

class MainNavigation extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    this.context.logout();
    this.props.client.resetStore();
  }

  render() {
    return (
      <AuthContext.Consumer>
        {context => (
          <header className="main-navigation">
            <div className="main-navigation__logo">
              <h1>Easy Event</h1>
            </div>
            <nav className="main-navigation__items">
              <ul>
                {!context.token && (
                  <li>
                    <NavLink to="/auth">Authentication</NavLink>
                  </li>
                )}
                <li>
                  <NavLink to="/events">Events</NavLink>
                </li>
                {context.token && (
                  <React.Fragment>
                    <li>
                      <NavLink to="/bookings">Bookings</NavLink>
                    </li>
                    <li>
                      <button onClick={this.logout}>Logout</button>
                    </li>
                  </React.Fragment>
                )}
              </ul>
            </nav>
          </header>
        )}
      </AuthContext.Consumer>
    );
  }
}
MainNavigation.propTypes = {
  client: PropTypes.object
};

export default withApollo(MainNavigation);
