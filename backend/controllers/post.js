const prisma = require('../prisma/client');
const fs = require('fs');

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
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    post
      ? res.status(200).json(post)
      : res.status(404).json({ message: 'Post not found' });
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
        ? await prisma.post.create({
            data: {
              authorId: authUser,
              title: title,
              content: content,
              likes: 0,
              dislikes: 0,
            },
          })
        : await prisma.post.create({
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
          });

      res.status(201).json({ message: 'You have sent a post successfully!' });
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

  try {
    if (post !== null) {
      if (authUser === parseInt(authorId)) {
        if (image === undefined) {
          await prisma.post.update({
            where: { id: parseInt(id) },
            data: {
              title: title,
              content: content,
            },
          });
        } else {
          post.imageUrl === null
            ? await prisma.post.update({
                where: { id: parseInt(id) },
                data: {
                  title: title,
                  content: content,
                  imageUrl: `${req.protocol}://${req.get('host')}/images/${
                    image.filename
                  }`,
                },
              })
            : fs.unlink(
                `images/${post.imageUrl.split('/images/')[1]}`,
                async () => {
                  await prisma.post.update({
                    where: { id: parseInt(id) },
                    data: {
                      title: title,
                      content: content,
                      imageUrl: `${req.protocol}://${req.get('host')}/images/${
                        req.file.filename
                      }`,
                    },
                  });
                }
              );
        }
        res.status(201).json({ message: 'Post updated successfully' });
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
      if (parseInt(userId) === authUser) {
        post.imageUrl === null
          ? await prisma.post.delete({ where: { id: postId } })
          : fs.unlink(
              `images/${post.imageUrl.split('/images/')[1]}`,
              async () => {
                await prisma.post.delete({ where: { id: postId } });
              }
            );
        res
          .status(200)
          .json({ message: `Post with id ${postId} was deleted successfully` });
      } else {
        res.status(403).json({ message: 'Unauthorized user for posting' });
      }
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.likePost = async (req, res) => {
  const authUser = req.auth.authorId;
  const { authorId, like } = req.body;
  const postId = parseInt(req.params.id);
  const post = await prisma.post.findUnique({ where: { id: postId } });
  // Checker dans la table de liaison si le user a déja liké/disliké le post
  const getLikeOnTable = await prisma.user_post_like.findMany({
    where: { user_id: authUser, post_id: postId, likes: true },
  });
  const checkLikeStatus = getLikeOnTable.findIndex((el) => el.post_id);

  const getDislikeOnTable = await prisma.user_post_like.findMany({
    where: { user_id: authUser, post_id: postId, likes: false },
  });
  const checkDislikeStatus = getDislikeOnTable.findIndex((el) => el.post_id);

  try {
    if (post !== null) {
      if (authUser === authorId) {
        switch (like) {
          // cas où le user like le post
          case 1:
            if (checkLikeStatus === -1) {
              await prisma.user_post_like.create({
                data: {
                  user_id: authUser,
                  post_id: postId,
                  likes: true,
                },
              });
              // incrémentation du like
              await prisma.post.update({
                where: { id: postId },
                data: { likes: { increment: 1 } },
              });
              res.status(201).json({ message: `You liked the post ${postId}` });
            } else {
              res
                .status(400)
                .json({ message: 'You have already liked that post' });
            }
            break;
          // cas où le user dislike le post
          case -1:
            if (checkDislikeStatus === -1) {
              await prisma.user_post_like.create({
                data: {
                  user_id: authUser,
                  post_id: postId,
                  likes: false,
                },
              });
              // incrémentation du dislike
              await prisma.post.update({
                where: { id: postId },
                data: { dislikes: { increment: 1 } },
              });
              res
                .status(201)
                .json({ message: `You disliked the post ${postId}` });
            } else {
              res
                .status(400)
                .json({ message: 'You have already disliked that post' });
            }
            break;
          case 0:
            /* cas où le user annule son like/dislike : 
          suppression dans la table de liaison + 
          décrémentation du like/dislike dans la table post */
            if (checkLikeStatus === 0) {
              await prisma.user_post_like.deleteMany({
                where: { user_id: authUser, post_id: postId, likes: true },
              });
              await prisma.post.update({
                where: { id: postId },
                data: { likes: { increment: -1 } },
              });
              res
                .status(201)
                .json({ message: 'You have removed your like successfully' });
            }

            if (checkDislikeStatus === 0) {
              await prisma.user_post_like.deleteMany({
                where: { user_id: authUser, post_id: postId, likes: false },
              });
              await prisma.post.update({
                where: { id: postId },
                data: { dislikes: { increment: -1 } },
              });
              res.status(201).json({
                message: 'You have removed your dislike successfully',
              });
            }
            break;
        }
      } else {
        res.status(403).json({ message: 'Unauthorized user ' });
      }
    } else {
      res.status(404).json({ message: `Post ${postId} is not found` });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
