const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY_SALTED); // salt the secret key with base64
    const authorId = decodedToken.authorId;
    req.auth = {
      authorId: authorId,
    };
    next();
  } catch {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
