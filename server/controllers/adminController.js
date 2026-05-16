import courseModel from "../model/CourseModel.js";
import SectionModel from "../model/SectionModel.js";
import lectureModel from "../model/LectureModel.js";
import UserModel from "../model/UserModel.js";
import EnrollmentModel from "../model/EnrollmentModel.js";

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalCourses,
      totalLectures,
      totalEnrollments,
      recentEnrollments,
      topCourses,
      enrollmentsByDay,
    ] = await Promise.all([
      UserModel.countDocuments({ role: { $ne: "admin" } }),
      courseModel.countDocuments(),
      lectureModel.countDocuments(),
      EnrollmentModel.countDocuments(),

      // Last 5 enrollments with student + course info
      EnrollmentModel.find()
        .sort({ enrolledAt: -1 })
        .limit(5)
        .populate("user", "name email")
        .populate("course", "title thumbnail"),

      // Top 3 courses by enrolled students count
      courseModel
        .find()
        .sort({ totalStudents: -1 })
        .limit(3)
        .select("title thumbnail totalStudents"),

      // Enrollments per day for last 30 days
      EnrollmentModel.aggregate([
        {
          $match: {
            enrolledAt: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalCourses,
        totalLectures,
        totalEnrollments,
      },
      recentEnrollments,
      topCourses,
      enrollmentsByDay,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get All Courses (admin view) ─────────────────────────────────────────────
export const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await courseModel
      .find()
      .populate("creator", "name email")
      .populate("sections")
      .sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Create Course ────────────────────────────────────────────────────────────
export const createCourse = async (req, res) => {
  try {
    const {
      title, description, subtitle, thumbnail, trailerVideo,
      category, level, language, price, isFree, tags,
      requirements, learningOutcomes,
    } = req.body;

    // Auto-generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-" + Date.now();

    const newCourse = new courseModel({
      title, description, subtitle, thumbnail, trailerVideo,
      category, level, language, price, isFree, tags,
      requirements, learningOutcomes, slug,
      creator: req.user.id,
    });

    await newCourse.save();
    res.json({ success: true, message: "Course created successfully", course: newCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Course ────────────────────────────────────────────────────────────
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await courseModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Course not found" });
    res.json({ success: true, message: "Course updated", course: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Course ────────────────────────────────────────────────────────────
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseModel.findById(id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // Delete all sections and lectures belonging to this course
    await SectionModel.deleteMany({ course: id });
    await lectureModel.deleteMany({ course: id });
    await courseModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Course and all its content deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Course With Full Structure ──────────────────────────────────────────
export const getCourseWithStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseModel.findById(id).populate({
      path: "sections",
      populate: { path: "lectures", model: "Lecture", options: { sort: { order: 1 } } },
      options: { sort: { order: 1 } },
    });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Add Section ──────────────────────────────────────────────────────────────
export const addSection = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;

    const course = await courseModel.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const order = course.sections.length; // append at end
    const section = new SectionModel({ title, course: courseId, order });
    await section.save();

    course.sections.push(section._id);
    await course.save();

    res.json({ success: true, message: "Section added", section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Section ───────────────────────────────────────────────────────────
export const updateSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const updated = await SectionModel.findByIdAndUpdate(sectionId, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Section not found" });
    res.json({ success: true, message: "Section updated", section: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Section ───────────────────────────────────────────────────────────
export const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const section = await SectionModel.findById(sectionId);
    if (!section) return res.status(404).json({ success: false, message: "Section not found" });

    // Remove lectures inside this section
    await lectureModel.deleteMany({ _id: { $in: section.lectures } });

    // Remove section ref from course
    await courseModel.findByIdAndUpdate(section.course, {
      $pull: { sections: section._id },
    });

    await SectionModel.findByIdAndDelete(sectionId);
    res.json({ success: true, message: "Section and its lectures deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Add Lecture ──────────────────────────────────────────────────────────────
export const addLecture = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, description, videoUrl, duration, isPreviewFree, notes } = req.body;

    const section = await SectionModel.findById(sectionId);
    if (!section) return res.status(404).json({ success: false, message: "Section not found" });

    const order = section.lectures.length;
    const lecture = new lectureModel({
      title, description, videoUrl, duration, isPreviewFree, notes,
      order, course: section.course, unitId: sectionId,
    });
    await lecture.save();

    section.lectures.push(lecture._id);
    await section.save();

    // Also push to course.lectures
    await courseModel.findByIdAndUpdate(section.course, {
      $push: { lectures: lecture._id },
    });

    res.json({ success: true, message: "Lecture added", lecture });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Lecture ───────────────────────────────────────────────────────────
export const updateLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const updated = await lectureModel.findByIdAndUpdate(lectureId, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Lecture not found" });
    res.json({ success: true, message: "Lecture updated", lecture: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Lecture ───────────────────────────────────────────────────────────
export const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await lectureModel.findById(lectureId);
    if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

    // Remove from section
    await SectionModel.findByIdAndUpdate(lecture.unitId, {
      $pull: { lectures: lecture._id },
    });

    // Remove from course
    await courseModel.findByIdAndUpdate(lecture.course, {
      $pull: { lectures: lecture._id },
    });

    await lectureModel.findByIdAndDelete(lectureId);
    res.json({ success: true, message: "Lecture deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get All Users ────────────────────────────────────────────────────────────
export const getAllUsersAdmin = async (req, res, next) => {
  try {
    const users = await UserModel.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "enrollments", // This should match the collection name for EnrollmentModel
          localField: "_id",
          foreignField: "user",
          as: "enrollmentData",
        },
      },
      {
        $lookup: {
          from: "courses", // This should match the collection name for courseModel
          localField: "enrollmentData.course",
          foreignField: "_id",
          as: "courseData",
        },
      },
      {
        $project: {
          _id: 1,
          email: 1,
          name: 1,
          role: 1,
          isAccountVerified: 1,
          plainPassword: 1,
          lastLogin: 1,
          createdAt: 1,
          semester: 1,
          department: 1,
          enrolledCourses: "$courseData.title",
        },
      },
    ]);

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// ─── Delete User ──────────────────────────────────────────────────────────────
export const deleteUserAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ success: false, message: "Cannot delete an admin user" });
    }

    // Delete user's enrollments and progress
    await EnrollmentModel.deleteMany({ user: id });
    // Add progress deletion if you have a progress model
    // await ProgressModel.deleteMany({ user: id });

    await UserModel.findByIdAndDelete(id);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ─── Manual Enroll User ───────────────────────────────────────────────────────
export const enrollUserAdmin = async (req, res, next) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
      return res.status(400).json({ success: false, message: "User ID and Course ID are required." });
    }
    const existing = await EnrollmentModel.findOne({ user: userId, course: courseId });
    if (existing) {
      return res.status(400).json({ success: false, message: "User is already enrolled in this course." });
    }
    const enrollment = new EnrollmentModel({ user: userId, course: courseId });
    await enrollment.save();

    res.json({ success: true, message: "User successfully enrolled." });
  } catch (error) {
    next(error);
  }
};

// ─── Update User (admin view) ─────────────────────────────────────────────────
export const updateUserAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { semester, department } = req.body;
    
    const user = await UserModel.findByIdAndUpdate(
      id,
      { semester, department },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    next(error);
  }
};