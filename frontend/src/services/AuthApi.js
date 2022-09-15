import jwtDecode from 'jwt-decode';
import { getToken, addToken, removeToken, clearData } from './LocalStorage';
import AxiosClient from '../client/AxiosClient';

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
 * @return  {[{Object}|String]}      [ Objet: {user: détails du user, success:réussite du login}  / message d'erreur si échec) ]
 */
export async function login({ email, password }) {
  try {
    const response = await AxiosClient({
      method: 'post',
      url: 'api/auth/login',
      withCredentials: true,
      data: { email, password },
    });
    const user = response.data;
    const token = response.data.token;
    addToken('sessionToken', token);
    return { user: user, success: true };
  } catch (err) {
    return err.response.data.message;
  }
}

/**
 * [Fonction pour récupérer les détails du user dans le token
 * afin de le set dans le state de App.js pour ne pas perdre la session ]
 *
 * @return  {[Object]}  [ Objet contenant les détails du user | { }]
 */
export function userFromToken() {
  const token = getToken('sessionToken');
  if (token) {
    const { userId, email, name, lastName, role, imageUrl } = jwtDecode(token);
    return { userId, email, name, lastName, role, imageUrl };
  } else {
    return {};
  }
}

/**
 * [ Déconnexion :
 *   en supprimant le token du localStorage ]
 *
 */
export function logOut() {
  clearData();
}
