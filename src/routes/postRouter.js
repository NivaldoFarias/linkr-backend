import { Router } from 'express';
import { likePost, saveHashtags, unlikePost, getPost } from '../controllers/postController.js';
import { validateUserId } from '../middlewares/authMiddleware.js';
import { findUrl, createUrl, createPost, validatePostId, checkIfUserHasLikedPost } from '../middlewares/postMiddleware.js';
import requireToken from '../middlewares/requireToken.js';
import { validateSchema } from '../middlewares/schemaValidator.js';
import postSchema from '../schemas/postSchema.js';


const postRouter = Router();

postRouter.route('/').post(validateSchema(postSchema), requireToken, validateUserId, findUrl, createUrl, createPost, saveHashtags);

postRouter.route('/:postId').get(requireToken, validateUserId, validatePostId, getPost);
// postRouter.route('/:postId').put();
// postRouter.route('/:postId').delete();

postRouter.route('/:postId/like').post(requireToken, validateUserId, validatePostId, checkIfUserHasLikedPost, likePost);
postRouter.route('/:postId/unlike').post(requireToken, validateUserId, validatePostId, checkIfUserHasLikedPost, unlikePost);

export default postRouter;