export function removeToken(token) {
  window.localStorage.removeItem(token);
}
export function clearData() {
  window.localStorage.clear();
}
export function getToken(token) {
  return window.localStorage.getItem(token);
}

export function addToken(localStorageName, newToken) {
  window.localStorage.setItem(localStorageName, newToken);
}

export function addLikeTable(tableName, table) {
  window.localStorage.setItem(tableName, JSON.stringify(table));
}

export function getLikeTable(tableName) {
  return window.localStorage.getItem(tableName);
}

export function likeTable() {
  const table = getLikeTable('likes');
  if (table !== null) {
    return JSON.parse(table);
  }
  return [];
}

export function dislikeTable() {
  const table = getLikeTable('dislikes');
  if (table !== null) {
    return JSON.parse(table);
  }
  return [];
}
