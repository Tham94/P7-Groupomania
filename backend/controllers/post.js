const prisma = require('../prisma/client');
const fs = require('fs');

/**
 * [getAllPosts description]
 *
 * @param   {object}  req  [requête]
 * @param   {object}  res  [réponse de l'api]
 *
 * @return  {Array<object>}       [Tableau d'objet contenant tous les posts de la BDD]
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
 * @param   {object}  req  [requête]
 * @param   {object}  res  [réponse de l'api]
 *
 * @return  {object}       [Récupération du post voulu]
 */
exports.getOnePost = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    post
      ? res.status(200).json(post)
      : res.status(404).json({ message: "Ce post n'existe pas" });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getPostsByUser = async (req, res) => {
  const userId = req.auth.id;
  try {
    const userPosts = await prisma.post.findMany({
      where: { authorId: userId },
    });
    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * [createPost description]
 *
 ****Création d'un post avec ou sans image
 *
 */
exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const image = req.file;
  const authUser = req.auth.id;
  try {
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

    res.status(201).json({ message: 'Vous avez bien posté votre message' });
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * [updatePost description]
 **** Mise à jour d'un post 3 cas:
 * - uniquement du texte
 * - rajouter une image sur un post sans image
 * - modifier l'image postée
 */
exports.updatePost = async (req, res) => {
  const authUser = req.auth.id;
  const role = req.auth.role;
  const { id } = req.params;
  const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
  const { title, content } = req.body;
  const image = req.file;

  try {
    if (post !== null) {
      if (authUser === post.authorId || role === 'admin') {
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
      } else {
        res
          .status(403)
          .json({ message: 'Non autorisé pour modifier ce message' });
      }
      res
        .status(201)
        .json({
          message: 'Le message a bien été modifié',
          title: title,
          content: content,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
          }`,
        });
    } else {
      res.status(404).json({ message: 'Post inconnu' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

/**
 * [Suppression de l'image du post :
 * - suppression de l'image dans le stockage local
 * - envoyer la valeur null à la clé "imageUrl" du post ]
 *
 * @param   {[type]}  req  [requete]
 * @param   {[type]}  res  [reponse]
 *
 */
exports.deleteImage = async (req, res) => {
  const authUser = req.auth.id;
  const role = req.auth.role;
  const postId = parseInt(req.params.id);
  const post = await prisma.post.findUnique({ where: { id: postId } });
  try {
    if (authUser === post.authorId || role === 'admin') {
      fs.unlink(`images/${post.imageUrl.split('/images/')[1]}`, async () => {
        await prisma.post.update({
          where: { id: postId },
          data: { imageUrl: null },
        });
      });
      res.status(200).json({ message: `L'\image a bien été supprimé` });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * [deletePost description]
 *
 * Suppression d'un post :
 * - sans image
 * - avec image
 */
exports.deletePost = async (req, res) => {
  const authUser = req.auth.id;
  const role = req.auth.role;
  const postId = parseInt(req.params.id);
  const post = await prisma.post.findUnique({ where: { id: postId } });
  try {
    if (post !== null) {
      if (authUser === post.authorId || role === 'admin') {
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
          .json({ message: `Le message n° ${postId} a bien été supprimé` });
      } else {
        res.status(403).json({ message: 'Non autorisé' });
      }
    } else {
      res.status(404).json({ message: 'Message inconnu' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getLikes = async (req, res) => {
  const authUser = req.auth.id;
  try {
    const result = await prisma.user_post_like.findMany({
      where: { user_id: authUser, likes: true },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.getDislikes = async (req, res) => {
  const authUser = req.auth.id;
  try {
    const result = await prisma.user_post_like.findMany({
      where: { user_id: authUser, likes: false },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json(error);
  }
};

/**
 * [likePost description]
 * Like ou Dislike d'un post (switch sur la valeur de la requete like : 1; -1 ou 0):
 * - recherche du like dans la table de liaison
 * - si non trouvé, liker (true) ou disliker (false)
 * - incrémentation du like/dislike dans la table post
 * - possibilité de retirer son like/dislike
 * - décrémentation du like/dislike dans la table post
 *
 */
exports.likePost = async (req, res) => {
  const authUser = req.auth.id;
  const { like } = req.body;
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
      switch (like) {
        case 1:
          if (checkLikeStatus === -1) {
            await prisma.user_post_like.create({
              data: {
                user_id: authUser,
                post_id: postId,
                likes: true,
              },
            });
            await prisma.post.update({
              where: { id: postId },
              data: { likes: { increment: 1 } },
            });
            res
              .status(201)
              .json({ message: `Vous venez de liker le message n° ${postId}` });
          } else {
            res
              .status(400)
              .json({ message: 'Vous avez déjà liké ce messsage' });
          }
          break;
        case -1:
          if (checkDislikeStatus === -1) {
            await prisma.user_post_like.create({
              data: {
                user_id: authUser,
                post_id: postId,
                likes: false,
              },
            });
            await prisma.post.update({
              where: { id: postId },
              data: { dislikes: { increment: 1 } },
            });
            res
              .status(201)
              .json({ message: `Vous avez disliké le message n° ${postId}` });
          } else {
            res
              .status(400)
              .json({ message: 'Vous avez déjà disliké ce messsage' });
          }
          break;
        case 0:
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
              .json({ message: 'Vous avez bien retiré votre like' });
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
              message: 'Vous avez bien retiré votre dislike',
            });
          }
          break;
      }
    } else {
      res
        .status(404)
        .json({ message: `Le message n° ${postId} n\est pas trouvé` });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
