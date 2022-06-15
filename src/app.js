import express from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes/index.js"
import ErrorHandler from "./middlewares/ErrorHandler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);
app.use(ErrorHandler);
export default app;


