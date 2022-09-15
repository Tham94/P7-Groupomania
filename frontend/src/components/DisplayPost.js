import Like from './Post/Like';
import AxiosClient from '../client/AxiosClient';
import { useEffect, useState, useContext } from 'react';
import { addLikeTable, getToken } from '../services/LocalStorage';
import { dateStringifier, sortByDate } from '../utils/DateHandling';
import Auth from '../contexts/Auth';
import InteractPost from './Post/InteractPost';

/**
 * [  Affichage de tous les posts par ordre antéchronologique
 *    Get tous les posts / users (pour récupérer leurs nom, prénom)
 *    Récupération du context user (user connecté ou admin) pour afficher les icones de modif/suppression
 *    Sauvegarde des tables dans le localStorage
 *    ]
 * @return  {JSX.Element}  [Composant affichant les posts]
 */
function DisplayPost() {
  const { user, likes, dislikes } = useContext(Auth);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const [showTopBtn, setShowTopBtn] = useState(false);

  /**
   * [  Au chargement de la page,
   *    transférer les tables likes & dislikes dans le localStorage
   *    Car il n'a pu être réaliser au moment du login:
   *    elles se sauvegardent bien mais passe en undefined lorque l'on est redirigé
   *    vers la page forum  ]
   *
   */
  useEffect(() => {
    addLikeTable('likes', likes);
    addLikeTable('dislikes', dislikes);
  });

  const isAdmin = () => {
    if (user.role === 'admin') {
      return true;
    }
  };
  async function fetchPosts() {
    const userToken = getToken('sessionToken');
    try {
      const response = await AxiosClient({
        url: 'api/posts/',
        headers: { Authorization: 'Bearer ' + userToken },
      });
      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchUsers(token) {
    const userToken = getToken('sessionToken', token);
    try {
      const response = await AxiosClient({
        url: 'api/auth/users/',
        headers: { Authorization: 'Bearer ' + userToken },
      });
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    fetchPosts();
  }, []);

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
      {posts &&
        posts.sort(sortByDate).map((post) => {
          const postAuthor = users.find((user) => user.id === post.authorId);
          const authUser = () => {
            if (user.userId === postAuthor.id) {
              return true;
            }
          };
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
                  <img alt="photo_de_profil" src={user.imageUrl} />
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
              <div className="Display__post-content">{post.content}</div>

              <Like likes={post.likes} dislikes={post.dislikes} id={post.id} />

              {(isAdmin() === true || authUser() === true) && (
                <InteractPost id={post.id} />
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
