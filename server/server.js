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

// Security and Error Handling
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { errorHandler } from "./middleware/errorHandler.js";
import axios from "axios";

const app = express();
app.set('trust proxy', 1); // Trust the first proxy (Render/Load Balancer)
const port = process.env.PORT || 4000;

connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'https://learn-hub-5fee5.web.app',
  'https://learn-hub-5fee5.firebaseapp.com',
  'https://learnhub.rewantsharma.online',
  process.env.CLIENT_URL,
].filter(Boolean);


app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(mongoSanitize());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests from this IP"
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Relaxed for better UX during dev/test
  message: "Too many login attempts. Please try again after 15 minutes."
});

app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.get("/ping", (req, res) => res.send("pong")); // Keep-alive endpoint

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/lecture", lectureRouter);
app.use("/api/enrollment", enrollmentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/downloads", downloadRouter);
app.use("/", uploadRoute);

app.use("/uploads", express.static("uploads"));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// Global Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
  console.log("GitHub OAuth routes ready at /api/auth/github");

  // Keep-Alive Ping (to prevent Render from sleeping)
  const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`;
  if (process.env.NODE_ENV === "production") {
    setInterval(() => {
      axios.get(`${url}/ping`)
        .then(() => console.log("Self-ping successful"))
        .catch((err) => console.error("Self-ping failed:", err.message));
    }, 14 * 60 * 1000); // Ping every 14 minutes
  }
});
