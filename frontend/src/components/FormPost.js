import { useState } from 'react';
import AxiosClient from '../client/AxiosClient';
import { getToken } from '../services/LocalStorage';

/**
 * [FormPost description]
 *
 * @return  {JSX.Element}  [Composant permettant de poster un message]
 */
function FormPost() {
  const [image, setImage] = useState(undefined);

  const handlePost = async (token) => {
    const title = document.querySelector('.Forum__post-title').value;
    const content = document.querySelector('.Forum__post-content').value;
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
        data: formData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="Forum__post-container">
        <h2 className="Forum__post-h2">Postes un message !</h2>
        <form type="POST" className="Forum__post" onSubmit={handlePost}>
          <input
            type="text"
            className="Forum__post-title"
            required
            placeholder="Titre *"
            name="title"
            aria-label="titre du post"
          ></input>

          <textarea
            type="text"
            className="Forum__post-content"
            placeholder="Ton message"
            name="content"
            aria-label="contenu du post"
          ></textarea>

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
          ></input>
          <button type="submit" className="Forum__post-submit">
            Je postes !
          </button>
        </form>
      </section>
    </>
  );
}

export default FormPost;
