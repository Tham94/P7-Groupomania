import '../styles/style.css';
import logo from '../assets/logo_banner.png';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import Auth from '../contexts/Auth';

function Header() {
  const { isAuthenticated } = useContext(Auth);

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
                  to="/"
                  className={({ isActive }) =>
                    isActive ? 'activeLink' : undefined
                  }
                >
                  <p className="link-text">Accueil</p>
                  <FontAwesomeIcon icon="fas fa-house" className="ft-icon" />
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive ? 'activeLink' : undefined
                  }
                >
                  <p className="link-text">S'inscrire</p>
                  <FontAwesomeIcon
                    icon="fas fa-right-to-bracket"
                    className="ft-icon"
                  />
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/profile"
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
                  to="/forum"
                  className={({ isActive }) =>
                    isActive ? 'activeLink' : undefined
                  }
                >
                  <p className="link-text">Forum</p>
                  <FontAwesomeIcon icon="far fa-comments" className="ft-icon" />
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? 'activeLink' : undefined
                  }
                >
                  <p className="link-text">Déconnexion</p>
                  <FontAwesomeIcon
                    icon="fas fa-right-from-bracket"
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
              <FontAwesomeIcon icon="fas fa-envelope" className="ft-icon" />
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
