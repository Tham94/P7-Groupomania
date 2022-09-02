export const dateStringifier = (num) => {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const timestamp = Date.parse(num);

  const date = new Date(timestamp).toLocaleDateString('fr-FR', options);

  return date.toString();
};

export const sortByDate = (a, b) => {
  return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
};
