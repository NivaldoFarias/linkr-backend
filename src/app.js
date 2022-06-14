import express from "express";
import helmet from "helmet";
import cors from "cors";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import hashtagsRouter from "./routers/hashtags.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/hashtags', hashtagsRouter);


app.use(ErrorHandler);
export default app;


