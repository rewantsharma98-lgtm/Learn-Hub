import EnrollmentModel from "../model/EnrollmentModel.js";
import ProgressModel from "../model/ProgressModel.js";
import courseModel from "../model/CourseModel.js";
import userModel from "../model/UserModel.js";

export const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        // Check if already enrolled
        const existing = await EnrollmentModel.findOne({ user: userId, course: courseId });
        if (existing) {
            return res.json({ success: false, message: "Already enrolled in this course" });
        }

        // Fetch user and course to check semester compatibility
        const user = await userModel.findById(userId);
        const course = await courseModel.findById(courseId);

        if (!user || !course) {
            return res.json({ success: false, message: "User or Course not found" });
        }

        // CHECK IF COURSE IS LOCKED
        if (course.isLocked && user.role !== 'admin') {
            return res.status(403).json({ 
                success: false,
                message: "Enrollment is currently locked for this course. Please wait for the official launch!",
                isLocked: true 
            });
        }

        // Restriction: Student semester must match course target semester
        // If course targetSemester is "All", anyone can enroll
        if (course.targetSemester !== "All" && user.role !== "admin") {
            if (user.semester !== course.targetSemester) {
                return res.json({ 
                    success: false, 
                    message: `Academic Restriction: You are in Semester ${user.semester}. You can only enroll in Semester ${user.semester} courses.` 
                });
            }
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
