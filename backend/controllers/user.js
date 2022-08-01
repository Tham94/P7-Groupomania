const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  const signedUser = await prisma.user.findUnique({ where: { email: email } });

  try {
    signedUser === null
      ? bcrypt.hash(password, 10).then(async (hash) => {
          await prisma.user
            .create({
              data: {
                email: email,
                password: hash,
              },
            })
            .then(() => {
              res
                .status(201)
                .json({ message: `${email} has joined the network` });
            })
            .catch((error) => {
              res.status(400).json({ message: error });
            });
        })
      : res.status(401).json({ message: `User ${email} is already signed` });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    await prisma.user
      .findUnique({
        where: {
          email: email,
        },
      })
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ error: `User ${email} is not found !` });
        } else {
          bcrypt
            .compare(password, user.password)
            .then((valid) => {
              if (!valid) {
                return res.status(403).json({ error: 'Invalid password' });
              }
              res.status(201).json({
                userId: user.id,
                token: jwt.sign(
                  { userId: user.id },
                  process.env.SECRET_KEY_SALTED,
                  {
                    expiresIn: '24h',
                  }
                ),
              });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const authUser = req.auth.authorId;

  try {
    authUser === parseInt(id)
      ? await prisma.user
          .delete({ where: { id: authUser } })
          .then(() => {
            res
              .status(200)
              .json({ message: `User ${id} account was deleted successfully` });
          })
          .catch((error) => {
            res.status(400).json(error);
          })
      : res
          .status(403)
          .json({ message: 'Unauthorized user for deleting his account ' });
  } catch (error) {
    res.status(500).json({ error });
  }
};
