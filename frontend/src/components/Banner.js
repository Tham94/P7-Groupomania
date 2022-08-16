import '../styles/style.css';
import logo from '../assets/logo_banner.png';

function Banner() {
  return (
    <>
      <div className="Banner__logo-container">
        <img
          className="Banner__logo-img"
          src={logo}
          alt="banniere groupomania"
        ></img>
      </div>
      <main className="Banner">
        <h1 className="Banner__title">Let's share !</h1>
        <p className="Banner__description">
          Rejoignez vos collègues dans votre réseau social !
        </p>
      </main>
    </>
  );
}

export default Banner;
