import express from "express";
import helmet from "helmet";
import cors from "cors";
import ErrorHandler from "./middleware/ErrorHandler.js";
import router from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(router);

app.use(ErrorHandler);
export default app;


