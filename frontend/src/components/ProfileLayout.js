import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import AxiosClient from '../client/AxiosClient';
import Auth from '../contexts/Auth';
import { getToken } from '../services/LocalStorage';
import ToModifyImage from './Profile/ImageModifyier';
import ToModifyLastName from './Profile/Lastname';
import ToModifyName from './Profile/Name';
import Unsubscribe from './Profile/Unsubscribe';

function ProfileLayout() {
  const { user } = useContext(Auth);
  const [image] = useState(undefined);
  const token = getToken('sessionToken');

  const isAdmin = () => {
    if (user.role === 'admin') {
      return true;
    } else {
      return false;
    }
  };

  const deleteImage = async () => {
    try {
      await AxiosClient({
        method: 'put',
        url: `api/auth/users/${user.id}/image/delete`,
        headers: { Authorization: 'Bearer ' + token },
        data: { imageUrl: null },
      });
      toast.success('Image de profil supprimée', {
        position: 'top-center',
        autoClose: 1000,
        closeOnClick: false,
        pauseOnHover: false,
      });
      window.location.reload();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
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
      <div>
        <ToModifyImage />
      </div>
      <div className="Profile__user">
        <div className="Profile__user-details">
          <ToModifyName />
        </div>
        <div className="Profile__user-details">
          <ToModifyLastName />
        </div>
        <div className="Profile__user-details">
          E-mail : <span className="User__email">{user.email}</span>
        </div>

        <div className="Profile__delete-handler">
          {user.imageUrl && image === undefined && (
            <button
              type="submit"
              className="Profile__pic-btn"
              onClick={() => {
                deleteImage();
              }}
            >
              Supprimer image
            </button>
          )}
          {!isAdmin() && <Unsubscribe />}
        </div>
      </div>
    </section>
  );
}

export default ProfileLayout;
