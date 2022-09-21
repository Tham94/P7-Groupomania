import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import AxiosClient from '../client/AxiosClient';
import Auth from '../contexts/Auth';
import { logOut } from '../services/AuthApi';
import { getToken } from '../services/LocalStorage';

function ProfileLayout() {
  const { user, setUser } = useContext(Auth);

  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingLastName, setIsUpdatingLastName] = useState(false);
  const [image, setImage] = useState(undefined);
  const [nameUpdated, setNameUpdated] = useState(user.name);
  const [lastNameUpdated, setLastNameUpdated] = useState(user.lastName);

  const token = getToken('sessionToken');

  const isAdmin = () => {
    if (user.role === 'admin') {
      return true;
    } else {
      return false;
    }
  };

  const modifyImage = async () => {
    const userImage = new FormData();
    userImage.append('image', image);
    if (image !== undefined) {
      try {
        await AxiosClient({
          method: 'put',
          url: `api/auth/users/${user.id}/image`,
          headers: { Authorization: 'Bearer ' + token },
          'Content-Type': 'multipart/form-data',
          data: userImage,
        });
        toast.success('Image de profil modifié', {
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
        console.log(error);
      }
    } else {
      return;
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

  const modifyName = async () => {
    try {
      await AxiosClient({
        method: 'put',
        url: `api/auth/users/${user.id}/name`,
        headers: { Authorization: 'Bearer ' + token },
        data: { name: nameUpdated },
      });
      setUser({ ...user, name: nameUpdated });
      setIsUpdatingName(false);
    } catch (error) {
      console.log(error);
    }
  };

  const modifyLastName = async () => {
    try {
      await AxiosClient({
        method: 'put',
        url: `api/auth/users/${user.id}/lastname`,
        headers: { Authorization: 'Bearer ' + token },
        data: { lastName: lastNameUpdated },
      });
      setUser({ ...user, lastName: lastNameUpdated });
      setIsUpdatingLastName(false);
    } catch (error) {
      console.log(error);
    }
  };

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
        <div>
          <div className="Profile__pic-modifyier">
            <label htmlFor="image" className="Profile__pic-label">
              Modifier votre image de profil
            </label>
            <input
              type="file"
              name="image"
              id="img-upload"
              className="Profile__pic-selector"
              accept=".png, .jpg, .jpeg"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
          </div>

          {image !== undefined && (
            <button
              className="Profile__pic-btn"
              type="submit"
              onClick={() => {
                modifyImage();
              }}
            >
              Valider image
            </button>
          )}
        </div>
      </div>

      <div className="Profile__user">
        <div className="Profile__user-details">
          <div className="User__details-name">
            <div>
              Prénom : <span className="User__name">{user.name}</span>
            </div>
            {!isAdmin() && !isUpdatingName && (
              <div
                onClick={() => {
                  setIsUpdatingName(true);
                }}
              >
                <i className="fa-solid fa-pencil Modifying__post-icon"></i>
              </div>
            )}
            {isUpdatingName && (
              <>
                <input
                  className="Profile__edit-name"
                  type="text"
                  placeholder="Prénom"
                  value={nameUpdated}
                  aria-label="prénom utilisateur"
                  onChange={(e) => setNameUpdated(e.target.value)}
                ></input>
                <button type="submit" onClick={modifyName}>
                  Valider
                </button>
                <div
                  className="Modifying-name-cancel"
                  onClick={() => {
                    setIsUpdatingName(false);
                  }}
                >
                  <i className="fa-solid fa-backward"></i>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="Profile__user-details">
          <div className="User__details-name">
            <div>
              Nom : <span className="User__last-name">{user.lastName}</span>
            </div>
            {!isAdmin() && !isUpdatingLastName && (
              <div
                onClick={() => {
                  setIsUpdatingLastName(true);
                }}
              >
                <i className="fa-solid fa-pencil Modifying__post-icon"></i>
              </div>
            )}

            {isUpdatingLastName && (
              <>
                <input
                  className="Profile__edit-name"
                  type="text"
                  placeholder="Nom"
                  value={lastNameUpdated}
                  aria-label="nom utilisateur"
                  onChange={(e) => setLastNameUpdated(e.target.value)}
                ></input>
                <button type="submit" onClick={modifyLastName}>
                  Valider
                </button>
                <div
                  className="Modifying-name-cancel"
                  onClick={() => {
                    setIsUpdatingLastName(false);
                  }}
                >
                  <i className="fa-solid fa-backward"></i>
                </div>
              </>
            )}
          </div>
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
          {!isAdmin() && (
            <button type="submit" className="Unsubscribe" onClick={deleteUser}>
              Se désinscrire
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfileLayout;
