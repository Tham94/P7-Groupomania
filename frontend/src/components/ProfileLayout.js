import '../styles/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserContext from '../contexts/UserContext';
import { useContext } from 'react';

function ProfileLayout() {
  const { user } = useContext(UserContext);
  return (
    <section className="Profile__layout">
      <h1 className="Profile__title">Votre Profil</h1>
      <div className="Profile__pic-container">
        <img
          className="Profile__pic"
          alt="photo_de_profil"
          src={user.imageUrl}
        ></img>
      </div>
      <div className="Profile__user">
        <div className="Profile__user-details">
          <div className="User__details-name">
            <div>
              Prénom : <span className="User__name">{user.name}</span>
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
              Nom : <span className="User__last-name">{user.lastName}</span>
            </div>
            <FontAwesomeIcon
              icon="fa-solid fa-pencil"
              className="Modifying-icon"
            />
          </div>
        </div>

        <div className="Profile__user-details">
          E-mail : <span className="User__email">{user.email}</span>
        </div>
        <button type="submit" className="Unsuscribe">
          Se désinscrire
        </button>
      </div>
    </section>
  );
}

export default ProfileLayout;
