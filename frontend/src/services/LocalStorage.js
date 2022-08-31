export function removeToken(token) {
  window.localStorage.removeItem(token);
}

export function getToken(token) {
  return window.localStorage.getItem(token);
}

export function addToken(localStorageName, newToken) {
  window.localStorage.setItem(localStorageName, newToken);
}
