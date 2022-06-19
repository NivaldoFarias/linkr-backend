import { Router } from 'express';
import {
  likePost,
  saveHashtags,
  unlikePost,
  getPost,
  updatePost,
  deletePost
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

// Post new post
postRouter.route('/').post(validateSchema(postSchema), requireToken, validateUserId, findUrl, createUrl, createPost, saveHashtags,);

// Get post by id
postRouter.route('/:postId').get(requireToken, validateUserId, validatePostId, getPost);

// Update post by id
postRouter.route('/:postId').put(requireToken, validateUserId, validatePostId, validatePostText, updatePost);

// Delete post by id
postRouter.route('/:postId').delete(requireToken, validateUserId, validatePostId, deletePost);

// Like and unlike post by id
postRouter.route('/:postId/like').post(requireToken, validateUserId, validatePostId, checkIfUserHasLikedPost, likePost);
postRouter.route('/:postId/unlike').post(requireToken, validateUserId, validatePostId, checkIfUserHasLikedPost, unlikePost);

export default postRouter;
