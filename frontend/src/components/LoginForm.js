import '../styles/style.css';

function Form() {
  return (
    <div className="LoginFormLayout">
      <h2>Connexion</h2>
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
        <div className="Form__password-field">
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
        <div className="Form__checkbox">
          <label className="Form__checkbox-remember" for="remember">
            Se souvenir de moi
          </label>
          <input type="checkbox" id="checkbox" name="remember"></input>
        </div>
        <div>
          <input
            className="Form__submit-button"
            type="submit"
            value="Se connecter"
          ></input>
        </div>
      </form>
    </div>
  );
}

export default Form;
