import chalk from 'chalk';
import { MIDDLEWARE } from '../blueprints/chalk.js';
import { hashtagRepository } from '../repositories/hashtags.js';
import { postsRepository } from '../repositories/posts.js';
//import { userRepository } from '../repositories/users.js';

export async function saveHashtags(req, res, next) {
  const { text } = req.body;
  const { postId } = res.locals;
  const hashtags = text.match(/#[a-zA-Z0-9]+/g);
  const cleanHashtags = hashtags.map((hashtag) => hashtag.substring(1).toLowerCase());
  if (hashtags) {
    try {
      const hashtagIds = await Promise.all(
        cleanHashtags.map(async (hashtag) => {
          const foundHashtag = await hashtagRepository.findHashtag(hashtag);
          if (foundHashtag) {
            return foundHashtag.id;
          } else {
            const newHashtag = await hashtagRepository.createHashtag(hashtag);
            return newHashtag.id;
          }
        }),
      );

      await Promise.all(
        hashtagIds.map(async (hashtagId) => {
          const foundHashtagPost = await hashtagRepository.findHashtagPost(hashtagId, postId);
          if (!foundHashtagPost) {
            await hashtagRepository.createHashtagPost(hashtagId, postId);
          }
        }),
      );
    } catch (e) {
      next(e);
    }
  }

  res.sendStatus(201);
}

export async function likePost(_req, res) {
  const { userId, postId, userHasLikedPost } = res.locals;
  if (!userHasLikedPost) {
    try {
      await postsRepository.likePost(userId, postId);
      console.log(chalk.magenta(`${MIDDLEWARE} user liked post`));
      res.sendStatus(201);
    } catch (e) {
      res.sendStatus(500);
    }
  } else {
    console.log(chalk.magenta(`${MIDDLEWARE} nothing happened`));
    res.sendStatus(200);
  }
}

export async function unlikePost(_req, res) {
  const { userId, postId, userHasLikedPost } = res.locals;
  if (userHasLikedPost) {
    try {
      await postsRepository.unlikePost(userId, postId);
      console.log(chalk.magenta(`${MIDDLEWARE} user unliked post`));
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(500);
    }
  } else {
    console.log(chalk.magenta(`nothing happened`));
    res.sendStatus(200);
  }
}

export async function deletePost(req, res) {
  const { userId, postId } = res.locals;
  console.log('hello', userId, postId);
  try {
    await postsRepository.deleteHastagsPostsByPostId(postId);
    await postsRepository.deleteLikesByPostId(postId);
    await postsRepository.deletePostById(postId, userId);
    console.log(chalk.magenta(`${MIDDLEWARE} user delete post`));
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function updatePost(req, res) {
  const { postId, text } = res.locals;
  const hashtags = text.match(/#[a-zA-Z0-9]+/g);
  const cleanHashtags = hashtags.map((hashtag) => hashtag.substring(1).toLowerCase());
  console.log(cleanHashtags);

  try {
    await postsRepository.updatePost(postId, text);
    console.log(chalk.magenta(`${MIDDLEWARE} user update post`));

    const hashtagIds = await Promise.all(
      cleanHashtags.map(async (hashtag) => {
        const foundHashtag = await hashtagRepository.findHashtag(hashtag);
        if (foundHashtag) {
          return foundHashtag.id;
        } else {
          const newHashtag = await hashtagRepository.createHashtag(hashtag);
          return newHashtag.id;
        }
      }),
    );

    // check hashtags_posts and create if not exists
    await Promise.all(
      hashtagIds.map(async (hashtagId) => {
        const foundHashtagPost = await hashtagRepository.findHashtagPost(hashtagId, postId);
        if (!foundHashtagPost) {
          await hashtagRepository.createHashtagPost(hashtagId, postId);
        }
      }),
    );

    // delete hashtags_posts if not exists
    const hashtagsPosts = await hashtagRepository.findHashtagsPostsByPostId(postId);
    hashtagsPosts.forEach(async (hashtagPost) => {
      // if hashtagPost not in cleanHashtags, delete it
      if (!cleanHashtags.includes(hashtagPost.hashtag)) {
        await hashtagRepository.deleteHashtagPost(hashtagPost.id);
      }
    });

    console.log(chalk.magenta(`${MIDDLEWARE} updated post hashtags`));
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function getPost(_req, res) {
  const { postId } = res.locals;
  try {
    const post = await postsRepository.getPost(postId);
    const likes = await postsRepository.getPostLikes(post.id);
    post.totalLikes = likes.length;
    post.usersWhoLiked =
      likes.length > 0 ? likes.slice(0, likes.length > 2 ? 2 : likes.length) : [];
    post.userHasLiked = false;
    for (const like of likes) {
      if (like.userId === res.locals.userId) {
        post.userHasLiked = true;
      }
    }
    res.send(post);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}
