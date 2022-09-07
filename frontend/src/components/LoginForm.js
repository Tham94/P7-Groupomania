import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useContext, useEffect, useState } from 'react';
import Auth from '../contexts/Auth';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/AuthApi';
import { toast } from 'react-toastify';

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
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Auth);
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/forum');
    }
  }, [navigate, isAuthenticated]);

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
    const userDetails = loginResponse.user;
    if (loginResponse.success === true) {
      setIsAuthenticated(loginResponse.success);
      setUser(userDetails);
      navigate('/forum');
      function userNotNull() {
        if (userDetails.name !== null) {
          return userDetails.name;
        } else {
          return '';
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
        </Form>
      </Formik>
    </div>
  );
}

export default LoginForm;
