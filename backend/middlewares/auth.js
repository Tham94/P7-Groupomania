const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY_SALTED); // salt the secret key with base64
    const userId = decodedToken.userId;
    req.auth = {
      authorId: userId,
    };
    next();
  } catch {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
