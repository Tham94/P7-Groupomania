import AxiosClient from '../../client/AxiosClient';
import { toast } from 'react-toastify';
import { getToken } from '../../services/LocalStorage';

function DeleteImage(props) {
  /**
   * [ Suppression de l'image d'un post :
   *  - confirmation avant suppression
   * - si oui, requete 'put' pour donner la valeur 'null' à la propriété imageUrl du post
   * - affichage d'un toast ]
   *
   */
  const deleteImagePost = async () => {
    const token = getToken('sessionToken');
    const confirmation = window.confirm("Voulez-vous supprimer l'image?");
    if (confirmation) {
      try {
        await AxiosClient({
          method: 'put',
          url: `api/posts/${props.id}/image`,
          headers: { Authorization: 'Bearer ' + token },
          data: { imageUrl: null },
        });
        toast.info(`Supression...`, {
          position: 'top-center',
          autoClose: 1000,
          pauseOnHover: false,
        });
        setTimeout(() => {
          document.location.reload();
        }, 1000);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div
        className="DeleteImg-btn"
        onClick={() => {
          deleteImagePost();
        }}
      >
        Supprimer Image
      </div>
    </>
  );
}

export default DeleteImage;
