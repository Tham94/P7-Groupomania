import AxiosClient from '../../client/AxiosClient';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getToken } from '../../services/LocalStorage';

function InteractPost(props) {
  const token = getToken('sessionToken');
  const [isUpdated, setIsUpdated] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  /**
   * [ Suppression d'un post:
   * - demande de confirmation avant suppression
   * - si ok, suppression effectué
   * - rafraichissement de page ]
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
      setIsDeleted(true);
    }
  };

  useEffect(() => {
    if (isUpdated || isDeleted) {
      setTimeout(() => {
        document.location.reload();
      }, 1500);
      if (isDeleted) {
        toast.info(`Suppression en cours`, {
          position: 'top-center',
          autoClose: 1000,
          pauseOnHover: false,
        });
      }
      if (isUpdated) {
        toast.info(`Message modifié`, {
          position: 'top-center',
          autoClose: 1000,
          pauseOnHover: false,
        });
      }
    }
  }, [isUpdated, isDeleted]);

  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [content, setContent] = useState(props.content);
  const [image, setImage] = useState('');

  /**
   * [ Modification d'un post : avec construction d'un nouvel objet FormDate contenant les valeurs modifiées ]
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
      await AxiosClient({
        method: 'put',
        url: `api/posts/${props.id}`,
        headers: { Authorization: 'Bearer ' + token },
        'Content-Type': 'multipart/form-data',
        data: formData,
      });
      setIsUpdated(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="Interacting__post">
        <div
          onClick={() => {
            setIsUpdating(true);
          }}
        >
          <div>
            {isUpdating && (
              <form className="Forum__post" encType="multipart/form-data">
                <input
                  type="text"
                  className="Forum__post-title"
                  required
                  placeholder="Titre *"
                  name="title"
                  aria-label="titre du post"
                  autoFocus={true}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <textarea
                  className="Forum__post-content"
                  placeholder="Ton message"
                  name="content"
                  aria-label="contenu du post"
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
                <button
                  type="submit"
                  className="Forum__post-submit"
                  onClick={modifyPost}
                >
                  {' '}
                  Modifier
                </button>
              </form>
            )}
          </div>
          <i className="fa-solid fa-pencil Modifying__post-icon"></i>
        </div>
        <div onClick={deletePost}>
          <i className="fa-solid fa-trash Deleting__post-icon"></i>
        </div>
      </div>
    </>
  );
}

export default InteractPost;
