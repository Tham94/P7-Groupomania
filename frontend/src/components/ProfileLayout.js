import { useContext, useState } from 'react';
import Auth from '../contexts/Auth';
import ToDeleteProfilePic from './Profile/DeleteProfilePic';
import ToModifyImage from './Profile/ImageModifyier';
import ToModifyLastName from './Profile/Lastname';
import ToModifyName from './Profile/Name';
import Unsubscribe from './Profile/Unsubscribe';

function ProfileLayout() {
  const { user } = useContext(Auth);
  const [image] = useState(undefined);

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
          {user.imageUrl && image === undefined && <ToDeleteProfilePic />}
          {!isAdmin() && <Unsubscribe />}
        </div>
      </div>
    </section>
  );
}

export default ProfileLayout;
