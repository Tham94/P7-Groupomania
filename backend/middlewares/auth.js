const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY_SALTED); // salt the secret key with base64
    const { userId, role } = decodedToken;
    req.auth = {
      userId,
      role,
    };
    next();
  } catch {
    res.status(401).json({ message: `Echec de l'authentification` });
  }
};
