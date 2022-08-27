import '../styles/style.css';
import pic from '../assets/tm_profil.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ProfileLayout() {
  return (
    <section className="Profile__layout">
      <h1 className="Profile__title">Votre Profil</h1>
      <div className="Profile__pic-container">
        <img className="Profile__pic" alt="photo_de_profil" src={pic}></img>
      </div>
      <div className="Profile__user">
        <div className="Profile__user-details">
          <div className="User__details-name">
            <div>
              Prénom : <span className="User__name">Thamime</span>
            </div>
            <FontAwesomeIcon
              icon="fa-solid fa-pencil"
              className="Modifying-icon"
            />
          </div>
        </div>
        <div className="Profile__user-details">
          <div className="User__details-name">
            <div>
              Nom : <span className="User__last-name">Mouhamad</span>
            </div>
            <FontAwesomeIcon
              icon="fa-solid fa-pencil"
              className="Modifying-icon"
            />
          </div>
        </div>

        <div className="Profile__user-details">
          E-mail :{' '}
          <span className="User__email">thamime.mouhamad@gmail.com</span>
        </div>
        <p className="Unsuscribe">Se désinscrire</p>
      </div>
    </section>
  );
}

export default ProfileLayout;
