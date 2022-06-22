import { Router } from 'express';
import logThis from '../blueprints/logThis.js';
import { createNewComment } from '../controllers/commentsController.js';
import {
  likePost,
  saveHashtags,
  unlikePost,
  getPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { validateUserId } from '../middlewares/authMiddleware.js';
import { validateCommentText } from '../middlewares/commentsMiddleware.js';

import {
  findUrl,
  createUrl,
  createPost,
  validatePostId,
  checkIfUserHasLikedPost,
  validatePostText,
} from '../middlewares/postMiddleware.js';
import requireToken from '../middlewares/requireToken.js';
import { validateSchema } from '../middlewares/schemaValidator.js';
import postSchema from '../schemas/postSchema.js';


const postRouter = Router();

// POST

postRouter
  .route('/')
  .post(
    logThis('Post new post'),
    validateSchema(postSchema),
    requireToken,
    validateUserId,
    findUrl,
    createUrl,
    createPost,
    saveHashtags
  );

// GET, PUT, DELETE

postRouter.route('/:postId').get(logThis('Get post by id'), requireToken, validateUserId, validatePostId, getPost);

postRouter
  .route('/:postId')
  .put(logThis('Edit post'), requireToken, validateUserId, validatePostId, validatePostText, updatePost);

postRouter.route('/:postId').delete(logThis('Delete post'), requireToken, validateUserId, validatePostId, deletePost);

// LIKE-UNLIKE

postRouter
  .route('/:postId/like')
  .post(logThis('Like post'), requireToken, validateUserId, validatePostId, checkIfUserHasLikedPost, likePost);

postRouter
  .route('/:postId/unlike')
  .post(logThis('Unlike post'), requireToken, validateUserId, validatePostId, checkIfUserHasLikedPost, unlikePost);

// COMMENTS

postRouter.route('/:postId/comment')
  .post(
    requireToken,
    validatePostId,
    validateCommentText,
    createNewComment
  );

export default postRouter;
