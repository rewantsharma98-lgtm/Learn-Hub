import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true,
    trim: true,
  },

  slug: {
    type: String,
    unique: true,
  },

  subtitle: String,

  description: String,

  thumbnail: String,

  trailerVideo: String,

  category: {
    type: String,
    required: true,
  },

  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },

  language: {
    type: String,
    default: "English",
  },

  price: {
    type: Number,
    default: 0,
  },

  isFree: {
    type: Boolean,
    default: true,
  },

  status: {
    type: String,
    enum: ["Draft", "Published"],
    default: "Draft",
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  sections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],

  lectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },
  ],

  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  totalStudents: {
    type: Number,
    default: 0,
  },

  rating: {
    type: Number,
    default: 0,
  },

  reviewsCount: {
    type: Number,
    default: 0,
  },

  totalDuration: {
    type: Number,
    default: 0,
  },

  tags: [String],

  requirements: [String],

  learningOutcomes: [String],

  resources: [String],

  certificateEnabled: {
    type: Boolean,
    default: true,
  },

  targetSemester: {
    type: String,
    default: "All",
  },

  targetDepartment: {
    type: String,
    default: "All",
  },

  isLocked: {
    type: Boolean,
    default: false,
  },
},
{ timestamps: true }
);

const courseModel =
  mongoose.models.course || mongoose.model("course", courseSchema);

export default courseModel;