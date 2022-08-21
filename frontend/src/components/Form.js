import { Formik, Form, Field, ErrorMessage } from 'formik';

/**
 * [Form description]
 *
 * @param   {[string]}  props  [titre/texte du bouton]
 *
 * @return  {[JSX.Element]}         [return description]
 */
function FormSign(props) {
  return (
    <div className="FormLayout">
      <h2>{props.title}</h2>

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
              'Doit contenir 8 caractères, 1 majuscule, 1 minuscule, 2 chiffres';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form method="POST" className="Form">
            <label for="email">E-mail *</label>
            <Field
              type="email"
              name="email"
              placeholder="Entrer votre E-mail"
              id="email"
            />
            <ErrorMessage
              name="email"
              component="span"
              className="Form__alert"
            />
            <label for="password">Mot de passe *</label>
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="Form__submit-button"
            >
              {props.btnText}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default FormSign;
