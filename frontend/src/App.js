import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/style.css';

import Layout from './components/Layout';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Forum from './pages/Forum';
import Profile from './pages/Profile';

import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { hasAuthenticated } from './services/AuthApi';

import Auth from './contexts/Auth';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import { getToken } from './services/LocalStorage';
import AxiosClient from './client/AxiosClient';
import Data from './contexts/Data';

function App() {
  /* State pour authentifier la connexion (true/false) */
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthenticated());
  /* State pour maintenir la session en cas de refresh */
  const [user, setUser] = useState({});
  /* State pour maintenir afficher les données de l'API */
  const [allUsers, setAllUsers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  /* State pour maintenir les tables likes et dislikes */
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);

  useEffect(() => {
    const token = getToken('sessionToken');
    const fetchAuthUser = async () => {
      if (token) {
        const response = await AxiosClient({
          url: 'api/auth/users/user',
          headers: { Authorization: 'Bearer ' + token },
        });
        const user = response.data;
        setUser(user);
      }
    };
    fetchAuthUser().catch(console.error);
  }, []);

  useEffect(() => {
    const token = getToken('sessionToken');
    const fetchUsers = async () => {
      if (token) {
        const response = await AxiosClient({
          url: 'api/auth/users/',
          headers: { Authorization: 'Bearer ' + token },
        });
        setAllUsers(response.data);
      }
    };
    fetchUsers().catch(console.error);
  }, [user]);

  useEffect(() => {
    const token = getToken('sessionToken');
    const fetchPosts = async () => {
      if (token) {
        const response = await AxiosClient({
          url: 'api/posts/',
          headers: { Authorization: 'Bearer ' + token },
        });
        setAllPosts(response.data);
      }
    };
    fetchPosts().catch(console.error);
  }, [user]);

  useEffect(() => {
    const token = getToken('sessionToken');
    const fetchLikes = async () => {
      if (token) {
        const response = await AxiosClient({
          url: `api/posts/likes`,
          headers: { Authorization: 'Bearer ' + token },
        });
        const likeTable = response.data;
        setLikes(likeTable);
      }
    };
    fetchLikes().catch(console.error);
  }, [isAuthenticated]);

  useEffect(() => {
    const token = getToken('sessionToken');
    const fetchDislikes = async () => {
      if (token) {
        const response = await AxiosClient({
          url: `api/posts/dislikes`,
          headers: { Authorization: 'Bearer ' + token },
        });
        const dislikeTable = response.data;
        setDislikes(dislikeTable);
      }
    };
    fetchDislikes().catch(console.error);
  }, [isAuthenticated]);

  return (
    <Auth.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
      }}
    >
      <div className="App">
        <Data.Provider
          value={{
            allUsers,
            setAllUsers,
            allPosts,
            setAllPosts,
            likes,
            setLikes,
            dislikes,
            setDislikes,
          }}
        >
          <Layout>
            <Routes>
              <Route path="*" element={<Navigate to={'/login'} />} />
              <Route exact path="/login" element={<Home />} />
              <Route exact path="/signup" element={<SignUp />} />
              <Route element={<AuthenticatedRoute />}>
                <Route exact path="/profile/:id" element={<Profile />} />
                <Route exact path="/forum" element={<Forum />} />
              </Route>
            </Routes>
          </Layout>
        </Data.Provider>
      </div>
      <ToastContainer />
    </Auth.Provider>
  );
}

export default App;
