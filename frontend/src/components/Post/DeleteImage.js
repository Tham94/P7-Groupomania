import AxiosClient from '../../client/AxiosClient';
import { toast } from 'react-toastify';
import { getToken } from '../../services/LocalStorage';
import { useContext } from 'react';
import Data from '../../contexts/Data';

function DeleteImage(props) {
  const { userPosts, setUserPosts } = useContext(Data);
  const newUserPostList = userPosts.slice();
  /**
   * [ Suppression de l'image d'un post :
   *  - confirmation avant suppression
   * - si oui, requete 'put' pour donner la valeur 'null' à la propriété imageUrl du post
   * - affichage d'un toast ]
   *
   */
  const deleteImagePost = async () => {
    const token = getToken('sessionToken');
    const foundPost = userPosts.find((post) => post.id === props.id);
    const confirmation = window.confirm("Voulez-vous supprimer l'image?");
    if (confirmation) {
      try {
        await AxiosClient({
          method: 'put',
          url: `api/posts/${props.id}/image`,
          headers: { Authorization: 'Bearer ' + token },
          data: { imageUrl: null },
        });
        toast.success(`Image supprimée`, {
          position: 'top-center',
          autoClose: 500,
          pauseOnHover: false,
        });
        newUserPostList.push({ ...foundPost, imageUrl: null });
        const rowsToKeep = newUserPostList.filter(
          (toKeep) => toKeep.id !== props.id || toKeep.imageUrl === null
        );
        setUserPosts(rowsToKeep);
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
