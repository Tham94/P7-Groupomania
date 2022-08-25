import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';

/**
 * [Form description]
 *
 *
 * @return  {[JSX.Element]}         [return description]
 */
function LoginForm() {
  const handleLogin = async ({ email, password }) => {
    try {
      await axios({
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        url: `${process.env.REACT_APP_API_URL}api/auth/login`,
        withCredentials: true,
        data: { email, password },
      });
      //  window.location = '/forum';
    } catch (err) {
      console.log(err.response.data.message);
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
          <button type="submit" className="Form__submit-button">
            Se connecter
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default LoginForm;
