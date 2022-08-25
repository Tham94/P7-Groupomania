import '../styles/style.css';
import logo from '../assets/logo_banner.png';
import { NavLink } from 'react-router-dom';

function Header() {
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
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'activeLink' : undefined
              }
            >
              <p className="link-text">Accueil</p>
              <i className="fi fi-rr-home"></i>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive ? 'activeLink' : undefined
              }
            >
              <p className="link-text">S'enregistrer</p>
              <i className="fi fi-rr-sign-in-alt"></i>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? 'activeLink' : undefined
              }
            >
              <p className="link-text">Contact</p>
              <i className="fi fi-rr-envelope"></i>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
