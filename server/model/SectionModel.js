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
},
{ timestamps: true }
);

const SectionModel =
  mongoose.models.Section || mongoose.model("Section", sectionSchema);

export default SectionModel;