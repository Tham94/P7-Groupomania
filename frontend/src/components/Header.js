import logo from '../assets/logo_banner.png';
import { NavLink } from 'react-router-dom';
import React, { useContext } from 'react';
import Auth from '../contexts/Auth';
import { logOut } from '../services/AuthApi';
import { toast } from 'react-toastify';

function Header() {
  const {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    setLikes,
    setDislikes,
  } = useContext(Auth);

  const handleLogOut = () => {
    const confirmation = window.confirm('Voulez-vous vous déconnecté?');
    if (confirmation) {
      logOut();
      setIsAuthenticated(false);
      setUser({});
      setLikes([]);
      setDislikes([]);
      function userNotNull() {
        if (user.name !== null) {
          return user.name;
        } else {
          return '';
        }
      }
      toast.info(`A bientôt ${userNotNull()} 👋!`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <header className="Header">
      <div className="Header__logo-container">
        <img
          className="Header__logo-pic"
          alt="logo groupomania"
          src={logo}
        ></img>
      </div>
      <nav>
        <ul className="Header__nav-list">
          {!isAuthenticated ? (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? 'activeLink' : undefined
                  }
                >
                  <p className="link-text">Connexion</p>
                  <i className="fa-solid fa-house ft-icon"></i>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive ? 'activeLink' : undefined
                  }
                >
                  <p className="link-text">Inscription</p>
                  <i className="fa-solid fa-right-to-bracket ft-icon"></i>
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/forum"
                  className={({ isActive }) =>
                    isActive ? 'activeLink' : undefined
                  }
                >
                  <p className="link-text">Accueil</p>
                  <i className="fas fa-comments ft-icon"></i>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/profile/${user.userId}`}
                  className={({ isActive }) =>
                    isActive ? 'activeLink' : undefined
                  }
                >
                  <p className="link-text">Profil</p>
                  <i className="far fa-user ft-icon"></i>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? 'activeLink' : undefined
                  }
                  onClick={handleLogOut}
                >
                  <p className="link-text">Déconnexion</p>
                  <i className="fa-solid fa-right-from-bracket ft-icon"></i>
                </NavLink>
              </li>
            </>
          )}

          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? 'activeLink' : undefined
              }
            >
              <p className="link-text">Contact</p>
              <i className="fa-solid fa-envelope ft-icon"></i>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
