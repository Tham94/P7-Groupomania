import { useContext, useState } from 'react';
import AxiosClient from '../../client/AxiosClient';
import Auth from '../../contexts/Auth';
import { getToken } from '../../services/LocalStorage';

function ToModifyLastName() {
  const { user, setUser } = useContext(Auth);
  const [isUpdatingLastName, setIsUpdatingLastName] = useState(false);
  const [lastNameUpdated, setLastNameUpdated] = useState(user.lastName);
  const token = getToken('sessionToken');

  const isAdmin = () => {
    if (user.role === 'admin') {
      return true;
    } else {
      return false;
    }
  };
  const modifyLastName = async () => {
    try {
      await AxiosClient({
        method: 'put',
        url: `api/auth/users/${user.id}/lastname`,
        headers: { Authorization: 'Bearer ' + token },
        data: { lastName: lastNameUpdated },
      });
      setUser({ ...user, lastName: lastNameUpdated });
      setIsUpdatingLastName(false);
      document.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="User__details-name">
        <div>
          Nom : <span className="User__last-name">{user.lastName}</span>
        </div>
        {!isAdmin() && !isUpdatingLastName && (
          <div
            onClick={() => {
              setIsUpdatingLastName(true);
            }}
          >
            <i className="fa-solid fa-pencil Modifying__post-icon"></i>
          </div>
        )}

        {isUpdatingLastName && (
          <div className="Modifying-name-btn">
            <input
              className="Profile__edit-name"
              type="text"
              placeholder="Nom"
              value={lastNameUpdated}
              maxLength={20}
              aria-label="nom utilisateur"
              onChange={(e) => setLastNameUpdated(e.target.value)}
            ></input>

            <button type="submit" onClick={modifyLastName}>
              Valider
            </button>
            <div
              onClick={() => {
                setIsUpdatingLastName(false);
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

export default ToModifyLastName;
