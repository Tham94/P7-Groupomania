import '../styles/style.css';
import logo from '../assets/logo_banner.png';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import Auth from '../contexts/Auth';
import { logOut } from '../services/AuthApi';
import UserContext from '../contexts/UserContext';

function Header() {
  const { isAuthenticated, setIsAuthenticated } = useContext(Auth);
  const { user } = useContext(UserContext);
  const handleLogOut = () => {
    const confirmation = window.confirm('Voulez-vous vous déconnecté?');
    if (confirmation) {
      logOut();
      setIsAuthenticated(false);
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
                  <FontAwesomeIcon
                    icon="fa-solid fa-house"
                    className="ft-icon"
                  />
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
                  <FontAwesomeIcon
                    icon="fa-solid fa-right-to-bracket"
                    className="ft-icon"
                  />
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
                  <FontAwesomeIcon icon="far fa-comments" className="ft-icon" />
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
                  <FontAwesomeIcon
                    icon="fa-solid fa-user"
                    className="ft-icon"
                  />
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
                  <FontAwesomeIcon
                    icon="fa-solid fa-right-from-bracket"
                    className="ft-icon"
                  />
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
              <FontAwesomeIcon
                icon="fa-solid fa-envelope"
                className="ft-icon"
              />
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
