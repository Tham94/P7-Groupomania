import AxiosClient from '../client/AxiosClient';
import { useEffect, useState, useContext } from 'react';
import { getToken } from '../services/LocalStorage';
import { dateStringifier, sortByDate } from '../utils/DateHandling';
import Auth from '../contexts/Auth';

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
  const { user } = useContext(Auth);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const fetchPosts = async (token) => {
    const userToken = getToken('sessionToken', token);
    try {
      const response = await AxiosClient({
        url: 'api/posts/',
        headers: { Authorization: 'Bearer ' + userToken },
      });
      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await AxiosClient({
        url: 'api/auth/users/',
      });
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const isAdmin = () => {
    if (user.role === 'admin') {
      return true;
    }
  };

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

          return (
            <article className="Display__post" key={post.id}>
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
                  <img alt="photo_de_profil" src={user.imageUrl} />
                </div>
              </header>
              <h2 className="Display__post-title">{post.title} </h2>
              {post.imageUrl && (
                <a href={post.imageUrl} className="Display__post-img-container">
                  <img
                    alt="post_image"
                    src={post.imageUrl}
                    className="Display__post-img"
                  ></img>
                </a>
              )}
              <div className="Display__post-content">{post.content}</div>

              <div className="LikeOrNot">
                <div className="Like">
                  <i className="fa-solid fa-thumbs-up Like-icon"></i>
                  <span className="Like-count"> {post.dislikes}</span>
                </div>
                <div className="Like">
                  <i className="fa-solid fa-thumbs-down Like-icon Dislike"></i>
                  <span className="Like-count"> {post.dislikes}</span>
                </div>
              </div>

              {(isAdmin() === true || authUser() === true) && (
                <div className="Interacting__post">
                  <i className="fa-solid fa-pencil Modifying__post-icon"></i>
                  <i className="fa-solid fa-trash Deleting__post-icon"></i>
                </div>
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
