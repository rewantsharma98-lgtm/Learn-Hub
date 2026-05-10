import express from "express";
import { enrollInCourse, getMyCourses, updateProgress, getCourseProgress } from "../controllers/enrollmentController.js";
import userAuth from "../middleware/userAuth.js";

const enrollmentRouter = express.Router();

enrollmentRouter.post("/enroll", userAuth, enrollInCourse);
enrollmentRouter.get("/my-courses", userAuth, getMyCourses);
enrollmentRouter.post("/update-progress", userAuth, updateProgress);
enrollmentRouter.get("/progress/:courseId", userAuth, getCourseProgress);

export default enrollmentRouter;
