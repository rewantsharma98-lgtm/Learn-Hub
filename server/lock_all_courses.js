import mongoose from "mongoose";
import dotenv from "dotenv";
import courseModel from "./model/CourseModel.js";

dotenv.config();

async function lockAllCourses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const res = await courseModel.updateMany({}, { isLocked: true });
    console.log(`Locked ${res.modifiedCount} courses successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("Lock failed:", error);
    process.exit(1);
  }
}

lockAllCourses();
