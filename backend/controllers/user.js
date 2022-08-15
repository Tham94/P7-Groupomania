const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const fs = require('fs');

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  const signedUser = await prisma.user.findUnique({ where: { email: email } });

  try {
    signedUser === null
      ? bcrypt.hash(password, 10).then(async (hash) => {
          await prisma.user.create({
            data: {
              email: email,
              password: hash,
            },
          });

          res.status(201).json({ message: `${email} has joined the network` });
        })
      : res.status(401).json({ message: `User ${email} is already signed` });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email: email } });

  try {
    if (!user) {
      return res.status(404).json({ error: `User ${email} is not found !` });
    } else {
      bcrypt
        .compare(password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(403).json({ error: 'Invalid password' });
          }
          res.status(201).json({
            role: user.role,
            token: jwt.sign(
              { userId: user.id, role: user.role },
              process.env.SECRET_KEY_SALTED,
              {
                expiresIn: '24h',
              }
            ),
          });
        })
        .catch((error) => res.status(400).json({ error }));
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const authUser = req.auth.userId;
  /* Récupération de tous les Urls des images dans un tableau avant suppression */
  const allPostsOfUser = await prisma.post.findMany({
    where: { authorId: authUser },
  });
  const allUrl = [];
  allPostsOfUser.forEach((post) => {
    allUrl.push(post.imageUrl);
  });

  try {
    if (authUser === parseInt(id)) {
      // Suppression de toutes les images postées par le user
      for (let i = 0; i < allUrl.length; i++) {
        let filename = allUrl[i].split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          return;
        });
      }
      await prisma.user.delete({ where: { id: authUser } });
      res.status(200).json({
        message: `User ${id} account was deleted successfully`,
      });
    } else {
      res
        .status(403)
        .json({ message: 'Unauthorized user for deleting his account ' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
