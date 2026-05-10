import express from "express";

import {
  addLecture,
  getLecturesByCourse,
  updateLecture,
  deleteLecture,
  uploadLectureResource,
} from "../controllers/lectureController.js";

import userAuth from "../middleware/userAuth.js";

import upload from "../config/multer.js";

const lectureRouter = express.Router();

// ADD LECTURE
lectureRouter.post(
  "/add",
  userAuth,
  addLecture
);

// GET LECTURES
lectureRouter.get(
  "/course/:courseId",
  getLecturesByCourse
);

// UPDATE
lectureRouter.put(
  "/:id",
  userAuth,
  updateLecture
);

// DELETE
lectureRouter.delete(
  "/:id",
  userAuth,
  deleteLecture
);

// UPLOAD PDF NOTES
lectureRouter.post(
  "/upload-resource/:lectureId",
  userAuth,
  upload.single("file"),
  uploadLectureResource
);

export default lectureRouter;