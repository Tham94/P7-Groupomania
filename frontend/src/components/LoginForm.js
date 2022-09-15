import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useContext, useEffect, useState } from 'react';
import Auth from '../contexts/Auth';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/AuthApi';
import { toast } from 'react-toastify';
import AxiosClient from '../client/AxiosClient';
import { getToken } from '../services/LocalStorage';

/**
 * [ Récupération du contexte d'authentification;
 *   set du contexte user dans Auth  {userId, role,nom, prenom, email, token}
 *   Utilisation d'un state pour récupérer l'erreur de l'API (échec login) et afficher dans le DOM;
 *   Redirection de l'utilisateur (connecté) vers le forum pour l'empecher d'accéder au login;
 *   Exécution de la fonction handleLogin ]
 *
 * @return  {[JSX.Element]}         [Formulaire Formik avec gestion de la validation des champs]
 */
function LoginForm() {
  const {
    isAuthenticated,
    setIsAuthenticated,
    setUser,
    setLikes,
    setDislikes,
  } = useContext(Auth);

  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/forum');
    }
  }, [navigate, isAuthenticated]);

  async function getLikes() {
    const userToken = getToken('sessionToken');
    try {
      const response = await AxiosClient({
        url: `api/posts/likes`,
        headers: { Authorization: 'Bearer ' + userToken },
      });
      const getLikeTable = response.data;
      setLikes(getLikeTable);
    } catch (error) {
      console.log(error);
    }
  }

  async function getDislikes() {
    const userToken = getToken('sessionToken');
    try {
      const response = await AxiosClient({
        url: `api/posts/dislikes`,
        headers: { Authorization: 'Bearer ' + userToken },
      });
      const getDislikeTable = response.data;
      setDislikes(getDislikeTable);
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * [ Soumission du formulaire: redirection vers le forum si connecté ou affichage d'un message d'erreur ]
   *
   * @param   {[String]}  email     [ valeur de l'email ]
   * @param   {[String]}  password  [ valeur du mot de passe ]
   *
   * @return  {[Boolean|String]}            [ retour de l'API (true si connecté/ erreur si échec) ]
   */
  const handleLogin = async ({ email, password }) => {
    const loginResponse = await login({ email, password });
    getLikes();
    getDislikes();
    const userDetails = loginResponse.user;
    if (loginResponse.success === true) {
      setIsAuthenticated(loginResponse.success);
      setUser(userDetails);
      function userNotNull() {
        if (userDetails.name !== null) {
          return userDetails.name;
        } else {
          const userEmail = userDetails.email.split('@');
          return userEmail[0];
        }
      }
      toast.success(`Bienvenue ${userNotNull()} !`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        pauseOnHover: false,
        draggable: true,
      });
    } else {
      setApiError(loginResponse);
    }
  };

  return (
    <div className="FormLayout">
      <h2>Connexion</h2>

      <Formik
        initialValues={{ email: '', password: '' }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = 'Vous devez entrer votre e-mail';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'E-mail non valide';
          }

          if (!values.password) {
            errors.password = 'Vous devez entrer un mot de passe';
          }
          return errors;
        }}
        onSubmit={handleLogin}
      >
        <Form method="POST" className="Form">
          <label htmlFor="email">E-mail *</label>
          <Field
            type="email"
            name="email"
            placeholder="Entrer votre E-mail"
            id="email"
            autoFocus={true}
          />
          <ErrorMessage name="email" component="span" className="Form__alert" />
          <label htmlFor="password">Mot de passe *</label>
          <Field
            type="password"
            id="password"
            name="password"
            placeholder="Entrer votre mot de passe"
          />
          <ErrorMessage
            name="password"
            component="span"
            className="Form__alert"
          />
          {apiError !== undefined && (
            <p id="Form__alert--backend">{apiError}</p>
          )}
          <button type="submit" className="Form__submit-button">
            Se connecter
          </button>
          <a href="./signup" className="Link-to-signup">
            Je n'ai pas de compte
          </a>
        </Form>
      </Formik>
    </div>
  );
}

export default LoginForm;
