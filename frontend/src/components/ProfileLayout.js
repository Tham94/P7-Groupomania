import '../styles/style.css';
import { useContext } from 'react';
import Auth from '../contexts/Auth';

function ProfileLayout() {
  const { user } = useContext(Auth);
  const isAdmin = () => {
    if (user.role === 'admin') {
      return true;
    } else {
      return false;
    }
  };

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
            {!isAdmin() && (
              <i className="fa-solid fa-pencil Modifying__post-icon"></i>
            )}
          </div>
        </div>
        <div className="Profile__user-details">
          <div className="User__details-name">
            <div>
              Nom : <span className="User__last-name">{user.lastName}</span>
            </div>
            {!isAdmin() && (
              <i className="fa-solid fa-pencil Modifying__post-icon"></i>
            )}
          </div>
        </div>

        <div className="Profile__user-details">
          E-mail : <span className="User__email">{user.email}</span>
        </div>
        {!isAdmin() && (
          <button type="submit" className="Unsuscribe">
            Se désinscrire
          </button>
        )}
      </div>
    </section>
  );
}

export default ProfileLayout;
