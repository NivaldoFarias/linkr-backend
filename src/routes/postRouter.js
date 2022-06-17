import { Router } from 'express';
import { saveHashtags } from '../controllers/postController.js';
import { validateUserId } from '../middlewares/authMiddleware.js';
import { findUrl, createUrl, createPost } from '../middlewares/postMiddleware.js';
import requireToken from '../middlewares/requireToken.js';
import { validateSchema } from '../middlewares/schemaValidator.js';
import postSchema from '../schemas/postSchema.js';

const postRouter = Router();

postRouter.route('/').post(validateSchema(postSchema), requireToken, validateUserId, findUrl, createUrl, createPost, saveHashtags);

export default postRouter;