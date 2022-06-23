import chalk from "chalk";
import { MIDDLEWARE } from "../blueprints/chalk.js";
import { commentsRepository } from "../repositories/comments.js";
import { postsRepository } from "../repositories/posts.js";
import { followingsRepository } from '../repositories/followings.js';

export async function createNewComment(req, res) {
  const { userId, postId, text } = res.locals;

  try {
    await commentsRepository.createNewComment(userId, postId, text);
    console.log(chalk.magenta(`${MIDDLEWARE} comment created`));
    res.sendStatus(201);
  } catch (error) {
    console.log(chalk.red(`${MIDDLEWARE} something went wrong creating comment`));
    res.sendStatus(500);
  }
}

export async function getPostComments(req, res) {
  const { postId } = req.params
  const { userId } = res.locals
  try {
    const post = await postsRepository.getPost(postId);
    const comments = await commentsRepository.getPostComments(postId)
    for(const comment of comments) {
      const followed = await followingsRepository.getFollowing(comment.userId, userId);
      followed !== null ? comment.userIsFollowed = true : comment.userIsFollowed = false;
      post.userId === comment.userId ? comment.isPostAuthor = true : comment.isPostAuthor = false
    }
    
    const data = {
      totalComments: comments.length,
      comments: comments
    }

    res.send(data)
    
  } catch{
    console.log(chalk.red(`${MIDDLEWARE} something went wrong retriving comments`));
    res.sendStatus(500);
  }
  
}