import AxiosLike from '../../client/AxiosLike';
import AxiosClient from '../../client/AxiosClient';
import { getToken } from '../../services/LocalStorage';
import { useState, useContext, useEffect } from 'react';
import Auth from '../../contexts/Auth';

function Like(props) {
  const { user } = useContext(Auth);
  const userToken = getToken('sessionToken');
  const [likes, setLikes] = useState(props.likes);
  const [dislikes, setDislikes] = useState(props.dislikes);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const removeLike = async () => {
    await AxiosLike({
      url: `${props.id}/like`,
      headers: { Authorization: 'Bearer ' + userToken },
      data: { like: 0 },
    });
  };

  const checkLike = async () => {
    const response = await AxiosClient({
      url: `api/posts/${props.id}/userlike`,
      headers: { Authorization: 'Bearer ' + userToken },
    });
    if (response.data[0] !== undefined) {
      const isUserLiked = response.data[0].user_id;
      if (isUserLiked === user.userId) {
        setLiked(true);
      }
    }
  };
  const checkDislike = async () => {
    const response = await AxiosClient({
      url: `api/posts/${props.id}/userdislike`,
      headers: { Authorization: 'Bearer ' + userToken },
    });
    if (response.data[0] !== undefined) {
      const userDisliked = response.data[0].user_id;
      if (userDisliked === user) {
        setDisliked(true);
      }
    }
  };

  const handleLike = async () => {
    try {
      const getLike = await AxiosClient({
        url: `api/posts/${props.id}/userlike`,
        headers: { Authorization: 'Bearer ' + userToken },
      });
      if (getLike.data[0] === undefined) {
        await AxiosLike({
          url: `${props.id}/like`,
          headers: { Authorization: 'Bearer ' + userToken },
          data: { like: 1 },
        });
        setLikes(likes + 1);
      } else {
        removeLike();
        setLikes(likes - 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDislike = async () => {
    try {
      const getDislike = await AxiosClient({
        url: `api/posts/${props.id}/userdislike`,
        headers: { Authorization: 'Bearer ' + userToken },
      });
      if (getDislike.data[0] === undefined) {
        await AxiosLike({
          url: `${props.id}/like`,
          headers: { Authorization: 'Bearer ' + userToken },
          data: { like: -1 },
        });
        setDislikes(dislikes + 1);
      } else {
        removeLike();
        setDislikes(dislikes - 1);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkLike();
  });
  useEffect(() => {
    checkDislike();
  });
  return liked && !disliked ? (
    <>
      <div className="LikeOrNot">
        <div className="Like">
          <button onClick={handleLike} className=" like-btn ">
            <i className="fa-solid fa-thumbs-up Like-icon"></i>
          </button>
          <span className="Like-count"> {likes}</span>
        </div>
        <div className="Like">
          <button onClick={handleDislike} className=" dislike-btn ">
            <i className="fa-solid fa-thumbs-down Like-icon Dislike"></i>
          </button>
          <span className="Like-count"> {dislikes}</span>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="LikeOrNot">
        <div className="Like">
          <button onClick={handleLike} className=" like-btn ">
            <i className="fa-solid fa-thumbs-up Like-icon"></i>
          </button>
          <span className="Like-count"> {likes}</span>
        </div>
        <div className="Like">
          <button onClick={handleDislike} className=" dislike-btn ">
            <i className="fa-solid fa-thumbs-down Like-icon Dislike"></i>
          </button>
          <span className="Like-count"> {dislikes}</span>
        </div>
      </div>
    </>
  );
}

export default Like;
