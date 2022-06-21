import { Router } from "express";
import requireToken from '../middlewares/requireToken.js';
import { validatePostId } from "../middlewares/postMiddleware";
import { createNewComment } from "../controllers/commentsController";
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

export default commentsRouter