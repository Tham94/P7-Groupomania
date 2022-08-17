import '../styles/style.css';

function Form(props) {
  return (
    <div className="FormLayout">
      <h2>{props.title}</h2>
      <form method="POST" className="Form">
        <div className="Form__field--email">
          <label for="email">E-mail* :</label>
          <input
            type="text"
            id="email"
            name="email"
            required
            placeholder="Entrer votre E-mail"
          />
        </div>
        <p className="Form__alert--email"></p>
        <div className="Form__field--password">
          <label for="password">Mot de passe* :</label>
          <input
            type="text"
            id="password"
            name="password"
            required
            minlength="8"
            maxlength="50"
            placeholder="Entrer votre mot de passe"
          />
        </div>
        <p className="Form__alert--password"></p>
        <div>
          <input
            className="Form__submit-button"
            type="submit"
            value={props.btnText}
          ></input>
        </div>
      </form>
    </div>
  );
}

export default Form;
