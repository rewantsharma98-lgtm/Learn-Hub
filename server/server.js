import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import downloadRouter from "./routes/downloadRoutes.js";
import userRouter from "./routes/userRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
import lectureRouter from "./routes/lectureRoutes.js";
import enrollmentRouter from "./routes/enrollmentRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import path from "path";
import uploadRoute from "./routes/upload.js";

import { errorHandler } from "./middleware/errorHandler.js";
import axios from "axios";

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 4000;

// FIX for Node v22.5.0+ / v24+ Compatibility with Express 4
app.use((req, res, next) => {
  try {
    const query = req.query;
    Object.defineProperty(req, 'query', {
      value: query,
      writable: true,
      enumerable: true,
      configurable: true
    });
  } catch (e) {}
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'https://learn-hub-5fee5.web.app', 
    'https://learnhub.rewantsharma.online'
  ], 
  credentials: true 
}));

connectDB();

app.get("/ping", (req, res) => res.send("pong"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/lecture", lectureRouter);
app.use("/api/enrollment", enrollmentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/downloads", downloadRouter);
app.use("/", uploadRoute);

app.use("/uploads", express.static("uploads"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});
