import { useContext } from 'react';
import { toast } from 'react-toastify';
import AxiosClient from '../client/AxiosClient';
import Auth from '../contexts/Auth';
import { logOut } from '../services/AuthApi';
import { getToken } from '../services/LocalStorage';

function ProfileLayout() {
  const { user } = useContext(Auth);

  const token = getToken('sessionToken');

  const isAdmin = () => {
    if (user.role === 'admin') {
      return true;
    } else {
      return false;
    }
  };

  /**
   * [Suppression d'un compte utilisateur]
   *
   *
   */
  const deleteUser = async () => {
    const confirmation = window.confirm(
      'ATTENTION :Voulez-vous définitivement vous désinscrire?'
    );
    if (confirmation) {
      await AxiosClient({
        method: 'delete',
        url: `api/auth/users/${user.id}`,
        headers: { Authorization: 'Bearer ' + token },
      });
      toast.info('Suppression du compte en cours', {
        position: 'top-center',
        autoClose: 1000,
        closeOnClick: false,
        pauseOnHover: false,
      });
      setTimeout(() => {
        logOut();
        window.location.reload();
      }, 2000);
      setTimeout(() => {
        toast.info('Compte supprimé... au revoir 👋!', {
          position: 'top-right',
          autoClose: 1000,
          closeOnClick: false,
          pauseOnHover: false,
        });
      }, 2000);
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
              <div>
                <i className="fa-solid fa-pencil Modifying__post-icon"></i>
              </div>
            )}
          </div>
        </div>
        <div className="Profile__user-details">
          <div className="User__details-name">
            <div>
              Nom : <span className="User__last-name">{user.lastName}</span>
            </div>
            {!isAdmin() && (
              <div>
                <i className="fa-solid fa-pencil Modifying__post-icon"></i>
              </div>
            )}
          </div>
        </div>

        <div className="Profile__user-details">
          E-mail : <span className="User__email">{user.email}</span>
        </div>
        {!isAdmin() && (
          <button type="submit" className="Unsuscribe" onClick={deleteUser}>
            Se désinscrire
          </button>
        )}
      </div>
    </section>
  );
}

export default ProfileLayout;
