import Layout from './components/Layout';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Forum from './pages/Forum';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import DisplayPost from './components/DisplayPost';

import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { hasAuthenticated } from './services/AuthApi';
import Auth from './contexts/Auth';
import AuthenticatedRoute from './components/AuthenticatedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthenticated());

  return (
    <Auth.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="*" element={<Navigate to={'/login'} />} />
            <Route exact path="/login" element={<Home />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/contact" element={<Contact />} />
            <Route element={<AuthenticatedRoute />}>
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/forum" element={<Forum />} />
              <Route exact path="/forum/:id" element={<DisplayPost />} />
            </Route>
          </Routes>
        </Layout>
      </div>
    </Auth.Provider>
  );
}

export default App;
