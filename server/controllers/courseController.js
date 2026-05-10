import courseModel from "../model/CourseModel.js";

export const createCourse = async (req, res) => {
    try {
        const { title, description, thumbnail, category, level, hours } = req.body;
        const newCourse = new courseModel({
            title,
            description,
            thumbnail,
            category,
            level,
            hours,
            creator: req.user.id // Set by userAuth middleware
        });
        await newCourse.save();
        res.json({ success: true, message: "Course created successfully", course: newCourse });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const courses = await courseModel.find().populate("creator", "email");
        res.json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await courseModel.findById(id)
          .populate({
            path: "sections",
            populate: { path: "lectures", model: "Lecture", options: { sort: { order: 1 } } },
            options: { sort: { order: 1 } }
          })
          .populate("lectures");

        if (!course) return res.json({ success: false, message: "Course not found" });
        res.json({ success: true, course });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCourse = await courseModel.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await courseModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
