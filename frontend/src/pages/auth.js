import React, { Component } from 'react';

import AuthContext from '../context/auth-context';

import './auth.css';

export class AuthPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();

    this.state = {
      isLogin: true
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.switchModeHandler = this.switchModeHandler.bind(this);
  }

  switchModeHandler() {
    this.setState(prevState => ({ isLogin: !prevState.isLogin }));
  }

  submitHandler(event) {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    // Send a request to the backend
    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }`
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: { email: "${email}", password: "${password}" }) {
              _id
              email
            }
          }`
      };
    }

    fetch('http://localhost:8000/graphql?query', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed');
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.login.token) {
          this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration);
        }
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input id="email" ref={this.emailEl} type="email" />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input id="password" ref={this.passwordEl} type="password" />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button onClick={this.switchModeHandler} type="button">
            Switch to {this.state.isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
