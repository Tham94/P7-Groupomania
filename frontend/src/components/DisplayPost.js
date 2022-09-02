import img from '../styles/team.jpg';
import pic from '../assets/tm_profil.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AxiosClient from '../client/AxiosClient';
import { useEffect, useState, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { getToken } from '../services/LocalStorage';
import { dateStringifier, sortByDate } from '../utils/DateHandling';

/**
 * [  Affichage de tous les posts par ordre antéchronologique:
 *    Get tous les posts / users (pour récupérer leurs nom, prénom)
 *    Récupération du context user (user connecté ou admin) pour afficher les icones de modif/suppression
 *
 *    ]
 *
 * @return  {JSX.Element}  [Composant affichant les posts]
 */
function DisplayPost() {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchUsers();
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

  const fetchPosts = async (token) => {
    const userToken = getToken('sessionToken', token);
    const response = await AxiosClient({
      url: 'api/posts/',
      headers: { Authorization: 'Bearer ' + userToken },
    });
    setPosts(response.data);
  };

  const fetchUsers = async () => {
    const response = await AxiosClient({
      url: 'api/auth/users/',
    });
    setUsers(response.data);
  };

  const isAdmin = () => {
    if (user.role === 'admin') {
      return true;
    }
  };

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

          return (
            <section className="Display__post" key={post.id}>
              <header className="Display__post-header">
                <div className="Display__post-details">
                  <div className="Header__post-user">
                    {postAuthor.name} {postAuthor.lastName} a posté :
                  </div>
                  <div className="Header__post-date">
                    {dateStringifier(post.createdAt)}
                  </div>
                </div>
                <div className="Display__user-pic">
                  <img alt="photo_de_profil" src={pic} />
                </div>
              </header>
              <h2 className="Display__post-title">{post.title} </h2>
              <div className="Display__post-img-container">
                <img alt="post_image" src={img}></img>
              </div>
              <div className="Display__post-content">{post.content}</div>

              <div className="LikeOrNot">
                <div className="Like">
                  <FontAwesomeIcon
                    icon="fa-solid fa-thumbs-up"
                    className="Like-icon "
                  />
                  <span className="Like-count"> {post.dislikes}</span>
                </div>
                <div className="Like">
                  <FontAwesomeIcon
                    icon="fa-solid fa-thumbs-down"
                    className="Like-icon Dislike"
                  />
                  <span className="Like-count"> {post.dislikes}</span>
                </div>
              </div>

              {(isAdmin() === true || authUser() === true) && (
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
              )}
            </section>
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
          <FontAwesomeIcon icon="fa-solid fa-arrow-up" />
        </button>
      )}
    </>
  );
}

export default DisplayPost;
