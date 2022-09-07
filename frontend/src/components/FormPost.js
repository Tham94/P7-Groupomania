import React from 'react';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
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
        'Content-Type': 'multipart/form-data',
        data: formData,
      });
      window.location = '/forum';
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="Forum__post-container">
        <h2 className="Forum__post-h2">Postes un message !</h2>
        <Formik
          initialValues={{ title: '' }}
          validate={(values) => {
            const errors = {};
            if (!values.title) {
              errors.title = 'Vous devez renseigner un titre';
            }
            return errors;
          }}
          onSubmit={handlePost}
        >
          <Form
            className="Forum__post"
            encType="multipart/form-data"
            method="post"
          >
            <Field
              type="text"
              className="Forum__post-title"
              required
              placeholder="Titre *"
              name="title"
              aria-label="titre du post"
              autoFocus={true}
            />
            <ErrorMessage
              name="title"
              component="span"
              className="Form__alert"
            />

            <Field
              type="text"
              as="textarea"
              className="Forum__post-content"
              placeholder="Ton message"
              name="content"
              aria-label="contenu du post"
            />

            <Field
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
          </Form>
        </Formik>
      </section>
    </>
  );
}

export default FormPost;
