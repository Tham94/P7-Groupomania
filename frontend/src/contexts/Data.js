import React from 'react';

export default React.createContext({
  allUsers: [],
  setAllUsers: (value) => [],

  allPosts: [],
  setAllPosts: (value) => [],

  userPosts: [],
  setUserPosts: (value) => {},

  likes: [],
  setLikes: (value) => [],

  dislikes: [],
  setDislikes: (value) => [],
});
