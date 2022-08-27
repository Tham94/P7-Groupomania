import img from '../styles/team.jpg';
import pic from '../assets/tm_profil.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * [PostDisplay description]
 *
 * @return  {JSX.Element}  [Composant affichant un post]
 */
function DisplayPost() {
  return (
    <>
      <section className="Display__post">
        <header className="Display__post-header">
          <div className="Display__user-pic">
            <img alt="photo_de_profil" src={pic} />
          </div>
          <div className="Display__post-details">
            <div className="Header__post-user">Thamime MOUHAMAD a posté :</div>
            <div className="Header__post-date">Le 25 Aout 2022 à 17:00</div>
          </div>
        </header>
        <h2 className="Display__post-title">Titre </h2>
        <div className="Display__post-img-container">
          <img alt="post_image" src={img}></img>
        </div>
        <div className="Display__post-content">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </div>

        <div className="LikeOrNot">
          <div className="Like">
            <FontAwesomeIcon
              icon="fa-solid fa-thumbs-up"
              className="Like-icon"
            />
            <span className="Like-count"> 0</span>
          </div>
          <div className="Like">
            <FontAwesomeIcon
              icon="fa-solid fa-thumbs-down"
              className="Like-icon Dislike"
            />
            <span className="Like-count"> 0</span>
          </div>
        </div>
        <div className="Interacting__post">
          <FontAwesomeIcon
            icon="fa-solid fa-pencil"
            className="Modifying__post-icon"
          />
          <FontAwesomeIcon
            icon="fa-solid fa-trash"
            className="Deleting__post-icon"
          />
        </div>
      </section>
    </>
  );
}

export default DisplayPost;
