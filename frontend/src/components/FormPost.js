import React, { useEffect } from 'react';
import { useState } from 'react';
import AxiosClient from '../client/AxiosClient';
import { getToken } from '../services/LocalStorage';

/**
 * [Envoi d'un message contenant ou non une image, titre requis
 *  Une fois post envoyé, rafraichissement de la page ]
 *
 * @return  {JSX.Element}  [Composant permettant de poster un message]
 */
function FormPost() {
  const [isSubmited, setIsSubmited] = useState(false);
  const [image, setImage] = useState(undefined);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isSubmited) {
      document.location.reload();
    }
  }, [isSubmited]);

  /**
   * [ Soumission du formulaire :
   *   construction d'un nouvel objet FormData : avec données récupérer en dynamiques]
   *
   * @param   {event}  e      [évènement de soumission du formulaire]
   * @param   {string}  token  [token de l'utilisateur connecté]
   *
   *
   */
  const handlePost = async (e, token) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);
    const userToken = getToken('sessionToken', token);
    try {
      await AxiosClient({
        method: 'post',
        url: 'api/posts/',
        headers: { Authorization: 'Bearer ' + userToken },
        'Content-Type': 'multipart/form-data',
        data: formData,
      });
      setIsSubmited(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="Forum__post-container">
        <h1 className="Forum__post-h2">Postes un message !</h1>

        <form
          encType="multipart/form-data"
          className="Forum__post"
          onSubmit={handlePost}
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
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />

          <textarea
            type="text"
            className="Forum__post-content"
            placeholder="Ton message (500 caractères max.)"
            name="content"
            aria-label="contenu du post"
            maxLength={500}
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
          <button type="submit" className="Forum__post-submit">
            Je postes !
          </button>
        </form>
      </section>
    </>
  );
}

export default FormPost;
