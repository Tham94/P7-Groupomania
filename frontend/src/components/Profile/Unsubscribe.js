import { useContext } from 'react';
import { toast } from 'react-toastify';
import AxiosClient from '../../client/AxiosClient';
import Auth from '../../contexts/Auth';
import { logOut } from '../../services/AuthApi';
import { getToken } from '../../services/LocalStorage';

function Unsubscribe() {
  const { user } = useContext(Auth);
  const token = getToken('sessionToken');

  const deleteUser = async () => {
    const confirmation = window.confirm(
      'ATTENTION :Voulez-vous définitivement vous désinscrire?'
    );
    if (confirmation) {
      await AxiosClient({
        method: 'delete',
        url: `api/auth/users/${user.id}`,
        headers: { Authorization: 'Bearer ' + token },
      });
      toast.info('Suppression du compte en cours', {
        position: 'top-center',
        autoClose: 1000,
        closeOnClick: false,
        pauseOnHover: false,
      });
      setTimeout(() => {
        logOut();
        window.location.reload();
      }, 2000);
      setTimeout(() => {
        toast.info('Compte supprimé... au revoir 👋!', {
          position: 'top-right',
          autoClose: 1000,
          closeOnClick: false,
          pauseOnHover: false,
        });
      }, 2000);
    }
  };
  return (
    <>
      <button type="submit" className="Unsubscribe" onClick={deleteUser}>
        Se désinscrire
      </button>
    </>
  );
}

export default Unsubscribe;
