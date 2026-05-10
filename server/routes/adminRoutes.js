import express from "express";
import {
  getDashboardStats,
  getAllCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseWithStructure,
  addSection,
  updateSection,
  deleteSection,
  addLecture,
  updateLecture,
  deleteLecture,
  getAllUsersAdmin,
  enrollUserAdmin,
} from "../controllers/adminController.js";
import { uploadLectureResource } from "../controllers/lectureController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const adminRouter = express.Router();

// Protect all admin routes
adminRouter.use(adminAuth);

adminRouter.get("/dashboard", getDashboardStats);
adminRouter.get("/users", getAllUsersAdmin);
adminRouter.post("/users/enroll", enrollUserAdmin);

adminRouter.get("/courses", getAllCoursesAdmin);
adminRouter.post("/courses", createCourse);
adminRouter.put("/courses/:id", updateCourse);
adminRouter.delete("/courses/:id", deleteCourse);
adminRouter.get("/courses/:id/structure", getCourseWithStructure);
adminRouter.post("/courses/:courseId/sections", addSection);
adminRouter.put("/sections/:sectionId", updateSection);
adminRouter.delete("/sections/:sectionId", deleteSection);
adminRouter.post("/sections/:sectionId/lectures", addLecture);
adminRouter.put("/lectures/:lectureId", updateLecture);
adminRouter.delete("/lectures/:lectureId", deleteLecture);
adminRouter.post("/lectures/:lectureId/resource", upload.single("file"), uploadLectureResource);

export default adminRouter;