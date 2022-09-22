import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import AxiosClient from '../../client/AxiosClient';
import Auth from '../../contexts/Auth';
import { getToken } from '../../services/LocalStorage';

function ToModifyImage() {
  const { user, setUser } = useContext(Auth);
  const [image, setImage] = useState(undefined);
  const token = getToken('sessionToken');

  const modifyImage = async () => {
    const userImage = new FormData();
    userImage.append('image', image);
    if (image !== undefined) {
      try {
        const response = await AxiosClient({
          method: 'put',
          url: `api/auth/users/${user.id}/image`,
          headers: { Authorization: 'Bearer ' + token },
          'Content-Type': 'multipart/form-data',
          data: userImage,
        });
        toast.success('Image de profil modifié', {
          position: 'top-center',
          autoClose: 500,
          closeOnClick: false,
          pauseOnHover: false,
        });
        setUser({ ...user, imageUrl: response.data.newImageUrl });
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  };
  return (
    <>
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
    </>
  );
}

export default ToModifyImage;
