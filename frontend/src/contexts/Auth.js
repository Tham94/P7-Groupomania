import React from 'react';

export default React.createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value) => {},
  user: {
    userId: 0,
    email: '',
    name: '',
    lastName: '',
    role: '',
    imageUrl: '',
  },
  setUser: (value) => {},
});
