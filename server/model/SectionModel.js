import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true,
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },

  lectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },
  ],

  order: {
    type: Number,
    default: 0,
  },

  // Unit-level notes shown to students (view-only, no download)
  notes: {
    type: String,
    default: "",
  },

  // Google Drive embed URL for PYQ PDFs (view-only, no download)
  // Use: https://drive.google.com/file/d/FILE_ID/preview
  pyqUrl: {
    type: String,
    default: "",
  },
},
{ timestamps: true }
);

const SectionModel =
  mongoose.models.Section || mongoose.model("Section", sectionSchema);

export default SectionModel;