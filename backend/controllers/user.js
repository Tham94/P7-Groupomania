const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.signup = (req, res) => {
  const { email, password } = req.body;
  try {
    bcrypt.hash(password, 10).then(async (hash) => {
      await prisma.user
        .create({
          data: {
            email: email,
            password: hash,
          },
        })
        .then(() => {
          res.status(200).json({ message: `${email} has joined the network` });
        });
    });
  } catch (error) {
    res.status(403).json({ error });
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
          return res.status(404).json({ error: `'User not found !` });
        } else {
          bcrypt
            .compare(password, user.password)
            .then((valid) => {
              if (!valid) {
                return res.status(403).json({ error: 'Invalid password' });
              }
              res.status(200).json({
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
