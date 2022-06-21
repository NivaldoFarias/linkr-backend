import { Router } from "express";
import requireToken from '../middlewares/requireToken.js';
import { validatePostId } from "../middlewares/postMiddleware.js";
import { createNewComment } from "../controllers/commentsController.js";
import { validateCommentText } from "../middlewares/commentsMiddleware.js";

const commentsRouter = Router();

commentsRouter
    .route('/:postId')
    .post(
        requireToken,
        validatePostId,
        validateCommentText,
        createNewComment
    );

export default commentsRouter;