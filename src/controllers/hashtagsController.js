import chalk from 'chalk';
import { MIDDLEWARE, API } from '../blueprints/chalk.js';
import { hashtagRepository } from '../repositories/hashtags.js';
import { hashtagsPostsRepository } from '../repositories/hashtagsPosts.js';
import { likesRepository } from '../repositories/likes.js';
import { postsRepository } from '../repositories/posts.js';
import CustomError from '../util/CustomError.js';

export async function getTrendingHashtags(req, res) {
  try {
    const trending = await hashtagRepository.getTrendingHashtags();
    res.send(trending);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}

export async function getHashtagPosts(req, res) {
  try {
    const { hashtagId } = res.locals;
    const posts = await postsRepository.getPostsByHashtagId(hashtagId);

    for (const post of posts) {
      const likes = await likesRepository.getPostLikes(post.id);
      post.totalLikes = likes.length;
      post.usersWhoLiked =
        likes.length > 0 ? likes.slice(0, likes.length > 2 ? 2 : likes.length) : [];
      post.userHasLiked = false;
      for (const like of likes) {
        if (like.userId === res.locals.userId) {
          post.userHasLiked = true;
        }
      }
    }

    console.log(`[CONTROLLER] ${posts.length} posts`);
    res.send(posts);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}

export async function saveHashtags(req, res, next) {
  const { text } = req.body;
  const { postId } = res.locals;
  const hashtags = text.match(/#[a-zA-Z0-9]+/g) || [];
  const cleanHashtags = hashtags.map((hashtag) => hashtag.substring(1).toLowerCase());

  if (cleanHashtags) {
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

      console.log(chalk.magenta(`${MIDDLEWARE} finding hashtags posts...`));
      await Promise.all(
        hashtagIds.map(async (hashtagId) => {
          const foundHashtagPost = await hashtagsPostsRepository.findHashtagPost(hashtagId, postId);
          if (!foundHashtagPost) {
            await hashtagsPostsRepository.createHashtagPost(hashtagId, postId);
          }
        }),
      );

      console.log(chalk.magenta(`${MIDDLEWARE} hashtags created`));
      res.sendStatus(201);
    } catch (e) {
      next(e);
    }
  } else {
    console.log(chalk.magenta(`${MIDDLEWARE} no hashtags found`));
    res.sendStatus(201);
  }
}
