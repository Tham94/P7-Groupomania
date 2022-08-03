const prisma = require('../prisma/client');
const fs = require('fs');

exports.getAllPosts = async (req, res) => {
  try {
    const allPosts = await prisma.post.findMany();
    res.status(200).json(allPosts);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getOnePost = async (req, res) => {
  try {
    await prisma.post
      .findUnique({
        where: { id: parseInt(req.params.id) },
      })
      .then((post) => {
        post
          ? res.status(200).json(post)
          : res.status(404).json({ message: 'Post not found' });
      });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createPost = async (req, res) => {
  const { title, content, imageUrl, authorId } = req.body;
  const authUser = req.auth.authorId;

  try {
    if (authUser === parseInt(authorId)) {
      imageUrl === null
        ? await prisma.post
            .create({
              data: {
                authorId: authUser,
                title: title,
                content: content,
                likes: 0,
                dislikes: 0,
              },
            })
            .then(() => {
              res
                .status(201)
                .json({ message: 'You have sent a post successfully!' });
            })
            .catch((error) => res.status(400).json(error))
        : await prisma.post
            .create({
              data: {
                authorId: authUser,
                title: title,
                content: content,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
                }`,
                likes: 0,
                dislikes: 0,
              },
            })
            .then(() => {
              res
                .status(201)
                .json({ message: 'You have sent a post successfully!' });
            })
            .catch((error) => res.status(400).json(error));
    } else {
      res.status(403).json({ message: 'Unauthorized user for posting' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updatePost = async (req, res) => {
  const authUser = req.auth.authorId;
};
exports.deletePost = async (req, res) => {
  const authUser = req.auth.authorId;
  const postId = parseInt(req.params.id);
  const { userId } = req.body;
  const post = await prisma.post.findUnique({ where: { id: postId } });

  try {
    if (post !== null) {
      const filename = post.imageUrl.split('/images/')[1];
      parseInt(userId) === authUser
        ? fs.unlink(`images/${filename}`, async () => {
            await prisma.post
              .delete({ where: { id: postId } })
              .then(
                res.status(200).json({
                  message: `Post with id ${postId} was deleted successfully`,
                })
              )
              .catch((error) => {
                res.status(400).json(error);
              });
          })
        : res.status(403).json({ message: 'Unauthorized user for posting' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.likePost = async (req, res) => {
  const authUser = req.auth.authorId;
};
