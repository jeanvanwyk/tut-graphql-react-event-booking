import React from 'react';

export default React.createContext({
  token: null,
  tokenExpiration: null,
  userId: null,
  // eslint-disable-next-line no-unused-vars
  login: (token, userId, tokenExpiration) => {},
  logout: () => {}
});
