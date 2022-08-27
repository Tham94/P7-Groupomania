/**
 * [FormPost description]
 *
 * @return  {JSX.Element}  [Composant permettant de poster un message]
 */
function FormPost() {
  return (
    <>
      <section className="Forum__post-container">
        <h2 className="Forum__post-h2">Postez un message !</h2>
        <form type="POST" className="Forum__post">
          <input
            type="text"
            className="Forum__post-title"
            required
            placeholder="Titre *"
          ></input>
          <textarea
            type="text"
            className="Forum__post-content"
            placeholder="Votre message"
          ></textarea>
          <label htmlFor="img-upload">Ajouter une image</label>
          <input
            type="file"
            name="img-upload"
            id="img-upload"
            className="Forum__post-img"
            accept=".png, .jpg, .jpeg"
          ></input>
          <input
            type="submit"
            className="Forum__post-submit"
            value="Je postes !"
          ></input>
        </form>
      </section>
    </>
  );
}

export default FormPost;
