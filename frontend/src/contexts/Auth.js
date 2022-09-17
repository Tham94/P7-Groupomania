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

  allUsers: [],
  setAllUsers: (value) => [],

  allPosts: [],
  setAllPosts: (value) => [],

  likes: [],
  setLikes: (value) => [],

  dislikes: [],
  setDislikes: (value) => [],
});
