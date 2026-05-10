import EnrollmentModel from "../model/EnrollmentModel.js";
import ProgressModel from "../model/ProgressModel.js";
import courseModel from "../model/CourseModel.js";

export const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        // Check if already enrolled
        const existing = await EnrollmentModel.findOne({ user: userId, course: courseId });
        if (existing) {
            return res.json({ success: false, message: "Already enrolled in this course" });
        }

        const enrollment = new EnrollmentModel({
            user: userId,
            course: courseId
        });
        await enrollment.save();

        res.json({ success: true, message: "Enrolled successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getMyCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const enrollments = await EnrollmentModel.find({ user: userId }).populate({
            path: "course",
            populate: { path: "lectures" }
        });

        // Add progress data to each course
        const coursesWithProgress = await Promise.all(enrollments.map(async (en) => {
            const course = en.course;
            if (!course) return null;

            const completedLectures = await ProgressModel.countDocuments({
                user: userId,
                course: course._id,
                completed: true
            });

            const totalLectures = course.lectures.length;
            const progress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

            return {
                ...course.toObject(),
                progress,
                lessonsCompleted: completedLectures,
                totalLessons: totalLectures
            };
        }));

        res.json({ 
            success: true, 
            courses: coursesWithProgress.filter(c => c !== null) 
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateProgress = async (req, res, next) => {
    try {
        const { courseId, lectureId, completed, note } = req.body;
        const userId = req.user.id;

        const updateData = { course: courseId, lastWatched: Date.now() };
        if (completed !== undefined) updateData.completed = completed;
        if (note !== undefined) updateData.studentNote = note;

        const progress = await ProgressModel.findOneAndUpdate(
            { user: userId, lecture: lectureId },
            updateData,
            { upsert: true, new: true }
        );

        res.json({ success: true, progress });
    } catch (error) {
        next(error);
    }
};

export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const progress = await ProgressModel.find({ user: userId, course: courseId });
        res.json({ success: true, progress });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
