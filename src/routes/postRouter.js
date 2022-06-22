import { Router } from 'express';
import logThis from '../blueprints/logThis.js';
import {
  likePost,
  saveHashtags,
  unlikePost,
  getPost,
  updatePost,
  deletePost,
  checkPosts,
} from '../controllers/postController.js';
import { validateUserId } from '../middlewares/authMiddleware.js';

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

postRouter.route('/:postId').get(logThis('Get post by id'), requireToken, validateUserId, validatePostId, getPost);

postRouter
  .route('/:postId')
  .put(logThis('Edit post'), requireToken, validateUserId, validatePostId, validatePostText, updatePost);

postRouter.route('/:postId').delete(logThis('Delete post'), requireToken, validateUserId, validatePostId, deletePost);

postRouter
  .route('/:postId/like')
  .post(logThis('Like post'), requireToken, validateUserId, validatePostId, checkIfUserHasLikedPost, likePost);

postRouter
  .route('/:postId/unlike')
  .post(logThis('Unlike post'), requireToken, validateUserId, validatePostId, checkIfUserHasLikedPost, unlikePost);

postRouter
  .route('/check')
  .get(logThis('Check posts'), requireToken, validateUserId, checkPosts);
export default postRouter;
