import express from 'express';
import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } from '../controllers/courseController.js';
import userAuth from '../middleware/userAuth.js';

const courseRouter = express.Router();

courseRouter.get('/all', getAllCourses);
courseRouter.post('/create', userAuth, createCourse);
courseRouter.get('/:id', getCourseById);
courseRouter.put('/:id', userAuth, updateCourse);
courseRouter.delete('/:id', userAuth, deleteCourse);

export default courseRouter;
