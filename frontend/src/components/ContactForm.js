import '../styles/style.css';

function ContactForm() {
  return (
    <div className="ContactFormLayout">
      <h2>Contact</h2>
      <form method="POST" className="Form">
        <div className="Form__email-field">
          <label for="email">E-mail* :</label>
          <input
            type="text"
            id="email"
            name="email"
            required
            placeholder="Entrer votre E-mail"
          />
        </div>
        <div className="Form__description-field">
          <label for="description">Message * :</label>
          <textarea
            id="description"
            name="description"
            required
            minlength="8"
            maxlength="500"
            placeholder="Décrivez votre problème (500 caractères max.)"
          ></textarea>
        </div>

        <div>
          <input
            className="Form__submit-button"
            type="submit"
            value="Envoyer"
          ></input>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
