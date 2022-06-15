import { Router } from "express";
import { newPost } from "../controllers/postController.js";
import { validateSchema } from "../middleware/schemaValidator.js";
import postSchema from "../schemas/postSchema.js";

const postRouter = Router();

postRouter.post("/posts", validateSchema(postSchema), newPost);

export default postRouter;