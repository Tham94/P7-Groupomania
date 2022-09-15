import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/style.css';

import Layout from './components/Layout';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Forum from './pages/Forum';
import Contact from './pages/Contact';
import Profile from './pages/Profile';

import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { hasAuthenticated, userFromToken } from './services/AuthApi';
import Auth from './contexts/Auth';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import { likeTable, dislikeTable } from './services/LocalStorage';

function App() {
  /* State pour authentifier la connexion (true/false) */
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthenticated());
  /* State pour maintenir la session en cas de refresh */
  const [user, setUser] = useState(userFromToken());
  /* State pour maintenir les tables avec le localStorage*/
  const [likes, setLikes] = useState(likeTable());
  const [dislikes, setDislikes] = useState(dislikeTable());

  return (
    <Auth.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        likes,
        setLikes,
        dislikes,
        setDislikes,
      }}
    >
      <div className="App">
        <Layout>
          <Routes>
            <Route path="*" element={<Navigate to={'/login'} />} />
            <Route exact path="/login" element={<Home />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/contact" element={<Contact />} />
            <Route element={<AuthenticatedRoute />}>
              <Route exact path="/profile/:id" element={<Profile />} />
              <Route exact path="/forum" element={<Forum />} />
            </Route>
          </Routes>
        </Layout>
      </div>
      <ToastContainer />
    </Auth.Provider>
  );
}

export default App;
