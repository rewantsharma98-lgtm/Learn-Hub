import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: String,
  fileUrl: String,
});

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  // YouTube URL
  videoUrl: {
    type: String,
    default: "",
  },

  // YouTube embed url
  videoEmbedUrl: {
    type: String,
    default: "",
  },

  duration: {
    type: Number,
    default: 0,
  },

  isPreviewFree: {
    type: Boolean,
    default: false,
  },

  isLocked: {
    type: Boolean,
    default: false,
  },

  // PDF notes/resources
  resources: [resourceSchema],

  notes: {
    type: String,
    default: "",
  },

  // Lecture order
  order: {
    type: Number,
    default: 1,
  },

  // Unit / Section
  unitTitle: {
    type: String,
    default: "Introduction",
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },

}, { timestamps: true });

const lectureModel =
  mongoose.models.Lecture ||
  mongoose.model("Lecture", lectureSchema);

export default lectureModel;