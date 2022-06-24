import chalk from 'chalk';
import { MIDDLEWARE } from '../blueprints/chalk.js';
import { hashtagRepository } from '../repositories/hashtags.js';
import { likesRepository } from '../repositories/likes.js';
import { postsRepository } from '../repositories/posts.js';
import { hashtagsPostsRepository } from '../repositories/hashtagsPosts.js';
import { getPostData } from '../util/Feed.utils.js';
import { sharesRepository } from '../repositories/shares.js';

export async function deletePost(req, res) {
  const { userId, postId } = res.locals;
  try {
    await hashtagsPostsRepository.deleteHashtagsPostsByPostId(postId);
    await sharesRepository.deleteSharesByPostId(postId);
    await likesRepository.deleteLikesByPostId(postId);
    await postsRepository.deletePost(postId);
    console.log(chalk.magenta(`${MIDDLEWARE} user delete post`));
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function updatePost(req, res) {
  const { postId, text } = res.locals;
  const hashtags = text.match(/#[a-zA-Z0-9]+/g) || [];
  const cleanHashtags = hashtags.map((hashtag) => hashtag.substring(1).toLowerCase());
  try {
    await postsRepository.updatePost(postId, text);

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
        const foundHashtagPost = await hashtagsPostsRepository.findHashtagPost(hashtagId, postId);
        if (!foundHashtagPost) {
          await hashtagsPostsRepository.createHashtagPost(hashtagId, postId);
        }
      }),
    );

    // delete hashtags_posts if not exists
    const hashtagsPosts = await hashtagsPostsRepository.findHashtagsPostsByPostId(postId);
    hashtagsPosts.forEach(async (hashtagPost) => {
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
  const { postId, userId } = res.locals;
  try {
    const post = await getPostData(postId, userId);
    console.log(chalk.magenta(`${MIDDLEWARE} post fetched`));
    res.send(post);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}
