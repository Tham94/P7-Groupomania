import '../styles/style.css';
import logo from '../assets/logo_banner.png';

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
            <p>Accueil</p>
            <i class="fi fi-rr-home"></i>
          </li>
          <li>
            <p>S'enregistrer</p>
            <i class="fi fi-rr-sign-in-alt"></i>
          </li>
          <li>
            <p>Contact</p>
            <i class="fi fi-rr-envelope"></i>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
