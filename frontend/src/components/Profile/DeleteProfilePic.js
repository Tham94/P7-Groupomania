import { useContext } from 'react';
import { toast } from 'react-toastify';
import AxiosClient from '../../client/AxiosClient';
import Auth from '../../contexts/Auth';
import { getToken } from '../../services/LocalStorage';

function ToDeleteProfilePic() {
  const { user, setUser } = useContext(Auth);
  const token = getToken('sessionToken');

  const deleteImage = async () => {
    const confirmation = window.confirm(
      'Voulez-vous supprimer votre image de profil ?'
    );
    if (confirmation) {
      try {
        await AxiosClient({
          method: 'put',
          url: `api/auth/users/${user.id}/image/delete`,
          headers: { Authorization: 'Bearer ' + token },
          data: { imageUrl: null },
        });
        toast.success('Image de profil supprimée', {
          position: 'top-center',
          autoClose: 500,
          closeOnClick: false,
          pauseOnHover: false,
        });
        setUser({ ...user, imageUrl: null });
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <>
      <button
        className="Profile__pic-btn"
        onClick={() => {
          deleteImage();
        }}
      >
        Supprimer image
      </button>
    </>
  );
}

export default ToDeleteProfilePic;
