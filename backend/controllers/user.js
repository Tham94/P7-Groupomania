const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const fs = require('fs');

exports.getUsers = async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getOneUser = async (req, res) => {
  const { id } = req.auth;
  try {
    const user = await prisma.user.findUnique({ where: { id: id } });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

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

          res.status(201).json({ message: `${email} a rejoind le réseau` });
        })
      : res
          .status(401)
          .json({ message: `L'utilisateur ${email} est déjà inscrit` });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email: email } });
  try {
    if (!user) {
      return res.status(404).json({ message: ` ${email} n'existe pas !` });
    } else {
      bcrypt
        .compare(password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(403).json({ message: 'Mot de passe incorrect' });
          }
          res.status(201).json({
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            imageUrl: user.imageUrl,
            role: user.role,
            id: user.id,
            token: jwt.sign(
              {
                id: user.id,
                role: user.role,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                imageUrl: user.imageUrl,
              },
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

exports.updateUserName = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.status(201).json({ message: 'Le prénom a bien été modifié' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.updateUserLastName = async (req, res) => {
  const { id } = req.params;
  const { lastName } = req.body;

  try {
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { lastName },
    });
    res.status(201).json({ message: 'Le nom a bien été modifié' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const authUser = req.auth.id;
  const role = req.auth.role;
  /* Récupération de tous les Urls des images dans un tableau avant suppression */
  const allPostsOfUser = await prisma.post.findMany({
    where: { authorId: authUser },
  });
  const allUrl = [];
  allPostsOfUser.forEach((post) => {
    allUrl.push(post.imageUrl);
  });

  try {
    if (authUser === parseInt(id) && role === 'member') {
      // Suppression de toutes les images postées par le user
      for (let i = 0; i < allUrl.length; i++) {
        let filename = allUrl[i].split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          return;
        });
      }
      await prisma.user.delete({ where: { id: authUser } });
      res.status(200).json({
        message: `Le compte de l'utilisateur n° ${authUser} a bien été supprimé`,
      });
    } else {
      res.status(403).json({
        message: 'Utilisateur non autorisé pour supprimer ce compte ',
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
