import lectureModel from "../model/LectureModel.js";
import courseModel from "../model/CourseModel.js";

// ─────────────────────────────
// HELPER
// ─────────────────────────────

const getYoutubeEmbedUrl = (url) => {
  if (!url) return "";
  try {
    const iframeMatch = url.match(/src=["'](.*?)["']/);
    const targetUrl = iframeMatch ? iframeMatch[1] : url;

    const match = targetUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url;
  } catch {
    return "";
  }
};

// ─────────────────────────────
// ADD LECTURE
// ─────────────────────────────

export const addLecture = async (req, res) => {
  try {

    const {
      title,
      description,
      videoUrl,
      notes,
      duration,
      isPreviewFree,
      order,
      unitTitle,
      courseId,
    } = req.body;

    const lecture = new lectureModel({
      title,
      description,
      videoUrl,
      notes: notes || "",
      videoEmbedUrl: getYoutubeEmbedUrl(videoUrl),
      duration,
      isPreviewFree,
      order,
      unitTitle,
      course: courseId,
    });

    await lecture.save();

    await courseModel.findByIdAndUpdate(
      courseId,
      {
        $push: {
          lectures: lecture._id,
        },
      }
    );

    res.json({
      success: true,
      message: "Lecture added successfully",
      lecture,
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });

  }
};

// ─────────────────────────────
// GET LECTURES
// ─────────────────────────────

export const getLecturesByCourse = async (req, res) => {
  try {

    const { courseId } = req.params;

    const lectures = await lectureModel
      .find({ course: courseId })
      .sort({ order: 1 });

    res.json({
      success: true,
      lectures,
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });

  }
};

// ─────────────────────────────
// UPDATE LECTURE
// ─────────────────────────────

export const updateLecture = async (req, res) => {
  try {

    const { id } = req.params;

    const data = req.body;

    if (data.videoUrl) {
      data.videoEmbedUrl =
        getYoutubeEmbedUrl(data.videoUrl);
    }

    const lecture =
      await lectureModel.findByIdAndUpdate(
        id,
        data,
        { new: true }
      );

    res.json({
      success: true,
      message: "Lecture updated successfully",
      lecture,
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });

  }
};

// ─────────────────────────────
// DELETE
// ─────────────────────────────

export const deleteLecture = async (req, res) => {
  try {

    const { id } = req.params;

    const lecture =
      await lectureModel.findByIdAndDelete(id);

    await courseModel.findByIdAndUpdate(
      lecture.course,
      {
        $pull: {
          lectures: id,
        },
      }
    );

    res.json({
      success: true,
      message: "Lecture deleted successfully",
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });

  }
};

// ─────────────────────────────
// UPLOAD PDF RESOURCE
// ─────────────────────────────

export const uploadLectureResource =
  async (req, res) => {

    try {

      const { lectureId } = req.params;

      const lecture =
        await lectureModel.findById(lectureId);

      if (!lecture) {
        return res.json({
          success: false,
          message: "Lecture not found",
        });
      }

      const fileUrl =
        `http://localhost:4000/uploads/notes/${req.file.filename}`;

      lecture.resources.push({
        title: req.file.originalname,
        fileUrl,
      });

      await lecture.save();

      res.json({
        success: true,
        message: "Resource uploaded",
        lecture,
      });

    } catch (error) {

      res.json({
        success: false,
        message: error.message,
      });

    }

};