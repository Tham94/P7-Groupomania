import AxiosLike from '../../client/AxiosLike';
import { getToken } from '../../services/LocalStorage';
import { useState, useContext } from 'react';
import Auth from '../../contexts/Auth';
import Data from '../../contexts/Data';

function Like(props) {
  const userToken = getToken('sessionToken');

  const { user } = useContext(Auth);
  const { likes, dislikes, setLikes, setDislikes } = useContext(Data);
  const newLikesTable = likes.slice();
  const newDislikeTable = dislikes.slice();

  const [likesCount, setLikesCount] = useState(props.likes);
  const [dislikesCount, setDislikesCount] = useState(props.dislikes);
  /**
   * [ Suite à un mauvais naming de id (id pour le backend - userId pour le token)
   * cette fonction permet de pouvoir utiliser un de ces 2 id qui ne soit pas undefined ]
   *
   * @return  {number}  [id du user venant du token || id venant du context(backend)]
   */
  const userIdChecked = () => {
    if (user.userId !== undefined) {
      return user.userId;
    } else {
      return user.id;
    }
  };

  /**
   * [Chercher dans la table likes quand le user connecté et le post correspond]
   *
   * @return  {boolean}  [true si le like est trouvé dans la table sinon false]
   */
  const isLiked = () => {
    const rowFound = likes.find(
      (row) => row.user_id === userIdChecked() && row.post_id === props.id
    );
    if (rowFound !== undefined) {
      return true;
    } else {
      return false;
    }
  };
  /**
   * [Chercher dans la table dislikes quand le user connecté et le post correspond]
   *
   * @return  {boolean}  [true si le dislike est trouvé dans la table sinon false]
   */
  const isDisliked = () => {
    const rowFound = dislikes.find(
      (row) => row.user_id === userIdChecked() && row.post_id === props.id
    );
    if (rowFound !== undefined) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * [Supprimer le like ou dislike en envoyant "0" au backend]
   *
   */
  const removeLike = async () => {
    await AxiosLike({
      url: `${props.id}/like`,
      headers: { Authorization: 'Bearer ' + userToken },
      data: { like: 0 },
    });
  };

  /**
   * Liker un post :
   * - vérifier si le post n'est pas liké :
   *    - Envoyer la requête "1" au backend
   *    - Incrémenter par 1 le compteur de likes dans le state
   *    - Ajouter cette nouvelle ligne dans le contexte
   *
   * - si déja liké :
   *    - envoyer la requête "0" au backend
   *    - Décrémenter par 1 le compteur de likes dans le state
   *    - Mettre à jour le contexte
   */
  const handleLike = async () => {
    if (!isLiked()) {
      await AxiosLike({
        url: `${props.id}/like`,
        headers: { Authorization: 'Bearer ' + userToken },
        data: { like: 1 },
      });
      setLikesCount((previousCount) => previousCount + 1);
      const newRow = {
        user_id: userIdChecked(),
        post_id: props.id,
        likes: true,
      };

      newLikesTable.push(newRow);
      setLikes(newLikesTable);
    } else {
      removeLike();
      setLikesCount((previousCount) => previousCount - 1);
      const rowsToKeep = likes.filter(
        (toKeep) =>
          toKeep.user_id !== userIdChecked() || toKeep.post_id !== props.id
      );
      setLikes(rowsToKeep);
    }
  };

  /**
   * Disliker un post :
   * - vérifier si le post n'est pas disliké :
   *    - Envoyer la requête "-1" au backend
   *    - Incrémenter par 1 le compteur de dislikes dans le state
   *    - Ajouter cette nouvelle ligne dans le contexte
   *
   * - si déja disliké :
   *    - envoyer la requête "0" au backend
   *    - Décrémenter par 1 le compteur de dislikes dans le state
   *    - Mettre à jour le contexte
   */
  const handleDislike = async () => {
    if (!isDisliked()) {
      await AxiosLike({
        url: `${props.id}/like`,
        headers: { Authorization: 'Bearer ' + userToken },
        data: { like: -1 },
      });
      setDislikesCount((previousCount) => previousCount + 1);
      const newRow = {
        user_id: userIdChecked(),
        post_id: props.id,
        likes: false,
      };
      newDislikeTable.push(newRow);
      setDislikes(newDislikeTable);
    } else {
      removeLike();
      setDislikesCount((previousCount) => previousCount - 1);
      const rowsToKeep = dislikes.filter(
        (toKeep) =>
          toKeep.user_id !== userIdChecked() || toKeep.post_id !== props.id
      );
      setDislikes(rowsToKeep);
    }
  };

  return (
    <>
      {isLiked() && (
        <div className="LikeOrNot">
          <div className="Like">
            <button onClick={handleLike} className="UserLiked">
              <i className="fa-solid fa-thumbs-up Like-icon"></i>
            </button>
            <span className="Like-count"> {likesCount}</span>
          </div>

          <div className="Like">
            <button className="dislike-btn Disable-btn">
              <i className="fa-solid fa-thumbs-down Like-icon--disable Dislike"></i>
            </button>
            <span className="Like-count"> {dislikesCount}</span>
          </div>
        </div>
      )}

      {isDisliked() && (
        <div className="LikeOrNot">
          <div className="Like">
            <button className="like-btn Disable-btn">
              <i className="fa-solid fa-thumbs-up Like-icon--disable"></i>
            </button>
            <span className="Like-count"> {likesCount}</span>
          </div>

          <div className="Like">
            <button onClick={handleDislike} className="UserLiked">
              <i className="fa-solid fa-thumbs-down Like-icon Dislike"></i>
            </button>
            <span className="Like-count"> {dislikesCount}</span>
          </div>
        </div>
      )}

      {!isLiked() && !isDisliked() && (
        <div className="LikeOrNot">
          <div className="Like">
            <button onClick={handleLike} className="like-btn">
              <i className="fa-solid fa-thumbs-up Like-icon"></i>
            </button>
            <span className="Like-count"> {likesCount}</span>
          </div>

          <div className="Like">
            <button onClick={handleDislike} className="dislike-btn ">
              <i className="fa-solid fa-thumbs-down Like-icon Dislike"></i>
            </button>
            <span className="Like-count"> {dislikesCount}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default Like;
