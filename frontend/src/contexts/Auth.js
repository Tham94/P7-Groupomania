import React from 'react';

export default React.createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value) => {},
  user: {
    id: 0,
    email: '',
    name: '',
    lastName: '',
    role: '',
    imageUrl: '',
    password: '',
  },
  setUser: (value) => {},
  likes: [],
  dislikes: [],
  setLikes: (value) => [],
  setDislikes: (value) => [],
});
