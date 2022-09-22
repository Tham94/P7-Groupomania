import { useContext, useState } from 'react';
import AxiosClient from '../../client/AxiosClient';
import Auth from '../../contexts/Auth';
import { getToken } from '../../services/LocalStorage';

function ToModifyName() {
  const { user, setUser } = useContext(Auth);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameUpdated, setNameUpdated] = useState(user.name);
  const token = getToken('sessionToken');

  const isAdmin = () => {
    if (user.role === 'admin') {
      return true;
    } else {
      return false;
    }
  };
  const modifyName = async () => {
    try {
      await AxiosClient({
        method: 'put',
        url: `api/auth/users/${user.id}/name`,
        headers: { Authorization: 'Bearer ' + token },
        data: { name: nameUpdated },
      });
      setUser({ ...user, name: nameUpdated });
      setIsUpdatingName(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="User__details-name">
        <div>
          Prénom : <span className="User__name">{user.name}</span>
        </div>
        {!isAdmin() && !isUpdatingName && (
          <div
            onClick={() => {
              setIsUpdatingName(true);
            }}
          >
            <i className="fa-solid fa-pencil Modifying__post-icon"></i>
          </div>
        )}
        {isUpdatingName && (
          <div className="Modifying-name-btn">
            {' '}
            <input
              className="Profile__edit-name"
              type="text"
              placeholder="Prénom"
              value={nameUpdated}
              maxLength={20}
              aria-label="prénom utilisateur"
              onChange={(e) => setNameUpdated(e.target.value)}
            ></input>
            <button type="submit" onClick={modifyName}>
              Valider
            </button>
            <div
              className="Modifying-name-cancel"
              onClick={() => {
                setIsUpdatingName(false);
              }}
            >
              <i className="fa-solid fa-backward"></i>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ToModifyName;
