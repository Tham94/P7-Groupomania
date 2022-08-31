import jwtDecode from 'jwt-decode';
import { getToken, addToken, removeToken } from './LocalStorage';
import axios from 'axios';

/**
 * [Etat du token]
 *
 * @param   {[type]}  token  [ token ]
 *
 * @return  {[Boolean]}         [retourne : true si la date d'expiration est > à la date actuelle/ false sinon]
 */
function tokenStatus(token) {
  const { exp } = jwtDecode(token);
  if (exp * 1000 > new Date().getTime()) {
    return true;
  }
  return false;
}

/**
 * [Permet de définir si l'utilisateur est authentifié en vérifiant s'il a un token]
 *
 * @return  {[Boolean]}  [true : si le token est présent/ false sinon]
 */
export function hasAuthenticated() {
  const token = getToken('sessionToken');
  const tokenValidation = token ? tokenStatus(token) : false;

  if (tokenValidation === false) {
    removeToken('sessionToken');
  }
  return tokenValidation;
}

/**
 * [Requête post pour se connecter]
 *
 * @param   {[String]}  email     [ valeur de l'email ]
 * @param   {[String]}  password  [ valeur du mot de passe ]
 *
 * @return  {[Boolean|String]}      [ true si token obtenu / erreur si échec) ]
 */
export async function login({ email, password }) {
  try {
    const response = await axios({
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      url: `${process.env.REACT_APP_API_URL}api/auth/login`,
      withCredentials: true,
      data: { email, password },
    });
    const token = response.data.token;
    addToken('sessionToken', token);
    return true;
  } catch (err) {
    return err.response.data.message;
  }
}

/**
 * [ Déconnexion :
 *   en supprimant le token du localStorage ]
 *
 */
export function logOut() {
  removeToken('sessionToken');
}
