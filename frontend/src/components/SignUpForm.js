import { useState } from 'react';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import AxiosClient from '../client/AxiosClient';

/**
 * [ Affichage du formulaire d'inscription avec soumission ]
 *
 *
 * @return  {[JSX.Element]}      [ Formulaire Formik avec gestion de la validation des champs ]
 */
function SignUpForm() {
  const [formSubmit, setFormSubmit] = useState(false);
  const [apiError, setApiError] = useState('');
  /**
   * [ Requête post pour s'enregistrer dans la base de données
   *   Redirection vers la page de connexion
   *   Affichage de l'erreur API si échec ]
   *
   * @param   {[type]}  email     [email ]
   * @param   {[type]}  password  [mot de passe ]
   *
   */
  const handleSignUp = async ({ email, password }) => {
    try {
      await AxiosClient({
        method: 'post',
        url: 'api/auth/signup',
        withCredentials: true,
        data: { email, password },
      });
      setFormSubmit(true);
      toast.success(" Tu t'es bien enregistré 👍, connectes-toi !", {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: false,
        pauseOnHover: false,
        draggable: true,
      });
      window.location = '/login';
    } catch (res) {
      const errorMsg = res.response.data.message;
      setApiError(errorMsg);
    }
  };
  return (
    <>
      <div className="FormLayout">
        <h2>Rejoindre la communauté</h2>

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
            } else if (
              !values.password.match(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]{2})(?=.{8,50})/
              )
            ) {
              errors.password =
                'Doit contenir 8 caractères dont 1 majuscule, 1 minuscule et 2 chiffres';
            }
            return errors;
          }}
          onSubmit={handleSignUp}
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
            <ErrorMessage
              name="email"
              component="span"
              className="Form__alert"
            />
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
              S'inscrire
            </button>
          </Form>
        </Formik>
      </div>
    </>
  );
}

export default SignUpForm;
