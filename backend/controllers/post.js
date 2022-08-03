const prisma = require('../prisma/client');
const fs = require('fs');
const { post } = require('../prisma/client');
const { Console } = require('console');

/**
 * [getAllPosts description]
 *
 * @param   {object}  req  [request]
 * @param   {object}  res  [response from the api]
 *
 * @return  {Array<object>}       [Array of objects containing all the posts in the DB]
 */
exports.getAllPosts = async (req, res) => {
  try {
    const allPosts = await prisma.post.findMany();
    res.status(200).json(allPosts);
  } catch (error) {
    res.status(400).json(error);
  }
};
/**
 * [getOnePost description]
 *
 * @param   {object}  req  [request]
 * @param   {object}  res  [response from the api]
 *
 * @return  {object}       [get the unique post requested into object type]
 */
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
  const { title, content, authorId } = req.body;
  const image = req.file;
  const authUser = req.auth.authorId;
  try {
    if (authUser === parseInt(authorId)) {
      image === undefined
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

/**
 * [updatePost description]
 *
 * @param   {[type]}  req  [req description]
 * @param   {[type]}  res  [res description]
 *
 * @return  {[type]}       [return description]
 */
exports.updatePost = async (req, res) => {
  const authUser = req.auth.authorId;
  const { id } = req.params;
  const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
  const { authorId, title, content } = req.body;
  const image = req.file;
  console.log(post);
  try {
    if (post !== null) {
      if (authUser === parseInt(authorId)) {
        if (image === undefined) {
          prisma.post
            .update({
              where: { id: parseInt(id) },
              data: {
                title: title,
                content: content,
              },
            })
            .then(() => {
              res.status(201).json({
                message: 'Post updated successfully',
              });
            })
            .catch((error) => {
              res.status(400).json({ error });
            });
        } else {
          post.imageUrl === null
            ? prisma.post
                .update({
                  where: { id: parseInt(id) },
                  data: {
                    title: title,
                    content: content,
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${
                      image.filename
                    }`,
                  },
                })
                .then(() => {
                  res.status(201).json({
                    message: 'Post updated successfully',
                  });
                })
                .catch((error) => {
                  res.status(400).json({ error });
                })
            : fs.unlink(`images/${post.imageUrl.split('/images/')[1]}`, () => {
                prisma.post
                  .update({
                    where: { id: parseInt(id) },
                    data: {
                      title: title,
                      content: content,
                      imageUrl: `${req.protocol}://${req.get('host')}/images/${
                        req.file.filename
                      }`,
                    },
                  })
                  .then(() => {
                    res.status(201).json({
                      message: 'Post updated successfully',
                    });
                  })
                  .catch((error) => {
                    res.status(400).json({ error });
                  });
              });
        }
      } else {
        res
          .status(403)
          .json({ message: `Unauthorized user to update the post ${id}` });
      }
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
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
