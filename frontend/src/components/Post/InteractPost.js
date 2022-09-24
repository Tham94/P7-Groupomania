import AxiosClient from '../../client/AxiosClient';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getToken } from '../../services/LocalStorage';
import Data from '../../contexts/Data';

function InteractPost(props) {
  const token = getToken('sessionToken');
  const [isUpdated, setIsUpdated] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const { userPosts, setUserPosts } = useContext(Data);
  const newUserPostsList = userPosts.slice();

  useEffect(() => {
    if (isDeleted) {
      toast.info(`Post supprimé 👍`, {
        position: 'top-center',
        autoClose: 1000,
        pauseOnHover: false,
      });
    }
    if (isUpdated) {
      toast.info(`Message modifié 👍`, {
        position: 'top-center',
        autoClose: 1000,
        pauseOnHover: false,
      });
    }
  }, [isUpdated, isDeleted]);
  /**
   * [ Suppression d'un post:
   * - demande de confirmation avant suppression
   * - si ok, suppression effectué
   * - mise à jour du State contenant les posts de l'utilisateur ]
   *
   * ]
   */
  const deletePost = async () => {
    const confirmation = window.confirm(
      'Voulez-vous supprimer définitivement ce post?'
    );
    if (confirmation) {
      await AxiosClient({
        method: 'delete',
        url: `api/posts/${props.id}`,
        headers: { Authorization: 'Bearer ' + token },
      });
      const rowsToKeep = userPosts.filter((toKeep) => toKeep.id !== props.id);
      setUserPosts(rowsToKeep);
      setIsDeleted(true);
    }
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [content, setContent] = useState(props.content);
  const [image, setImage] = useState('');
  const foundPost = userPosts.find((post) => post.id === props.id);

  /**
   * [ Modification d'un post :
   * - construction d'un nouvel objet FormDate contenant les valeurs modifiées
   * - récupération des nouvelles données depuis le backend pour afficher dans le state
   * - le post est supprimé de la liste puis ajouter avec les valeurs mises à jour ]
   *
   * @param   {event}  e  [évènement de soumission du formulaire de modification]
   *
   */
  const modifyPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);
    try {
      const response = await AxiosClient({
        method: 'put',
        url: `api/posts/${props.id}`,
        headers: { Authorization: 'Bearer ' + token },
        'Content-Type': 'multipart/form-data',
        data: formData,
      });
      const newTitle = response.data.title;
      const newContent = response.data.content;
      const imageUrlSetter = () => {
        if (response.data.imageUrl === undefined) {
          return null;
        } else {
          return response.data.imageUrl;
        }
      };
      const rowsToKeep = newUserPostsList.filter(
        (toKeep) => toKeep.id !== props.id
      );
      rowsToKeep.push({
        ...foundPost,
        title: newTitle,
        content: newContent,
        imageUrl: imageUrlSetter(),
      });

      setUserPosts(rowsToKeep);
      setIsUpdating(false);
      setIsUpdated(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="Interacting__post">
        {!isUpdating && (
          <>
            <div
              onClick={() => {
                setIsUpdating(true);
              }}
            >
              <i className="fa-solid fa-pencil Modifying__post-icon"></i>
            </div>
            <div onClick={deletePost}>
              <i className="fa-solid fa-trash Deleting__post-icon"></i>
            </div>
          </>
        )}

        {isUpdating && (
          <>
            <form
              className="Forum__post"
              encType="multipart/form-data"
              onSubmit={modifyPost}
            >
              <input
                type="text"
                className="Forum__post-title"
                required
                placeholder="Titre * (50 caractères max.)"
                name="title"
                aria-label="titre du post"
                autoFocus={true}
                maxLength={50}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <textarea
                className="Forum__post-content"
                placeholder="Ton message (500 caractères max.)"
                name="content"
                aria-label="contenu du post"
                maxLength={500}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
              <input
                type="file"
                name="image"
                id="img-upload"
                className="Forum__post-img"
                accept=".png, .jpg, .jpeg"
                aria-label="ajouter image"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
              />
              <div className="Forum__post-modify-btn">
                <button type="submit" className="Forum__post-submit">
                  Modifier
                </button>
                <div
                  className="Cancel-modif"
                  onClick={() => setIsUpdating(false)}
                >
                  Annuler
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}

export default InteractPost;
