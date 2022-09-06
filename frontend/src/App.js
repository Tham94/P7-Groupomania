import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/style.css';

import Layout from './components/Layout';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Forum from './pages/Forum';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import DisplayPost from './components/DisplayPost';

import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { hasAuthenticated, userFromToken } from './services/AuthApi';
import Auth from './contexts/Auth';
import AuthenticatedRoute from './components/AuthenticatedRoute';

function App() {
  /* State pour authentifié la connexion (true/false) */
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthenticated());
  /* State pour maintenir la session en cas de refresh */
  const [user, setUser] = useState(userFromToken());

  return (
    <Auth.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
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
              <Route exact path="/forum/:id" element={<DisplayPost />} />
            </Route>
          </Routes>
        </Layout>
      </div>
      <ToastContainer />
    </Auth.Provider>
  );
}

export default App;
