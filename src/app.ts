const morgan = require("morgan");
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { rateLimiter } from "../config/rateLimiter";
import { corsOptions } from "../config/corsOptions";
import usersRouter from "./routes/user/user-Routes";
import animalRouter from "./routes/pet/pet-Routes";
import checkoutRouter from "./routes/checkout/checkout-Routes";
import visitor from "./routes/visitor/visitor-Routes";
import transactionsRouter from "./routes/transaction/transaction-Routes";
import reviewsRouter from "./routes/review/review-Routes";
import commentRouter from "./routes/comment/comment-Routes";
import adminRouter from "./routes/admin/admin-Routes";

dotenv.config();
const app = express();

app.use(rateLimiter);
app.use(helmet());
// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRouter);
app.use("/pets", animalRouter);
app.use("/checkout", checkoutRouter);
app.use("/visitor", visitor);
app.use("/reviews", reviewsRouter);
app.use("/transactions", transactionsRouter);
app.use("/comments", commentRouter);
app.use("/admin", adminRouter);

module.exports = app;

//! este archivo está siendo importado en index.ts de la raíz
