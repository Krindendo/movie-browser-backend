require("dotenv").config();

// packages
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  optionSuccessStatus: 200
};

// routers
const authRouter = require("./routes/auth");
const movieRouter = require("./routes/movie");
const commentRouter = require("./routes/comments");
const actorRouter = require("./routes/actor");

// express
var app = express();

// database
const connectDB = require("./db/connect");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static(path.join(__dirname, "public")));

// security packages
app.use(helmet());
app.use(cors(corsOptions));
app.use(xss());
app.use(rateLimiter({ windowMs: 60 * 1000, max: 150 }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/movie", movieRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/actor", actorRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const connectToDB = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
connectToDB();
module.exports = app;
