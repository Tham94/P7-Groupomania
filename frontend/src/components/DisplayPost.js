import Like from './Post/Like';
import { useEffect, useState, useContext } from 'react';
import { dateStringifier, sortByDate } from '../utils/DateHandling';
import Auth from '../contexts/Auth';
import Data from '../contexts/Data';
import InteractPost from './Post/InteractPost';
import DeleteImage from './Post/DeleteImage';

/**
 * [  Affichage de tous les posts  :
 *    - Récupération du context user (user connecté ou admin) pour afficher les icones de modif/suppression
 *    - Récupération du context users & posts pour affichage des données dans les articles
 *    - tri des posts par ordre antéchronologique
 *    - bouton qui permet de ramener en haut de la fenêtre
 *
 * @return  {JSX.Element}  [Composant affichant les posts]
 */
function DisplayPost() {
  const { user } = useContext(Auth);
  const { allPosts, allUsers } = useContext(Data);

  const [showTopBtn, setShowTopBtn] = useState(false);

  const isAdmin = () => {
    if (user.role === 'admin') {
      return true;
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);

  return (
    <>
      {allUsers[0] !== undefined &&
        allPosts &&
        allPosts.sort(sortByDate).map((post) => {
          const postAuthor = allUsers.find((user) => user.id === post.authorId);
          const authUser = () => {
            if (user.id === postAuthor.id) {
              return true;
            }
          };
          /**
           * [Affichage du prénom et nom de l'utilisateur s'il en a un sinon affichage de son email]
           *
           * @return  {string}  [ Email de l'utilisateur ||  nom et prénom ]
           */
          const userIdentification = () => {
            if (postAuthor.name === null && postAuthor.lastName === null) {
              return postAuthor.email;
            } else {
              return [postAuthor.name, ' ', postAuthor.lastName];
            }
          };
          return (
            <article className="Display__post" key={post.id}>
              <header className="Display__post-header">
                <div className="Display__post-details">
                  <div className="Header__post-user">
                    {userIdentification()} a posté :
                  </div>
                  <div className="Header__post-date">
                    {dateStringifier(post.createdAt)}
                  </div>
                </div>
                <div className="Display__user-pic">
                  <img alt="photo_de_profil" src={postAuthor.imageUrl} />
                </div>
              </header>
              <h2 className="Display__post-title">{post.title} </h2>

              {post.imageUrl && (
                <a
                  href={post.imageUrl}
                  target="blank"
                  className="Display__post-img-container"
                >
                  <img
                    alt="post_image"
                    src={post.imageUrl}
                    className="Display__post-img"
                  ></img>
                </a>
              )}

              {post.imageUrl && (isAdmin() === true || authUser() === true) && (
                <DeleteImage id={post.id} />
              )}

              <div className="Display__post-content">{post.content}</div>

              <Like likes={post.likes} dislikes={post.dislikes} id={post.id} />

              {(isAdmin() === true || authUser() === true) && (
                <InteractPost
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  imageUrl={post.imageUrl}
                />
              )}
            </article>
          );
        })}

      {showTopBtn && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          id="scrollUp"
          title="Go to top"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      )}
    </>
  );
}

export default DisplayPost;
