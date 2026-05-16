import mongoose from "mongoose";
import dotenv from "dotenv";
import lectureModel from "./model/LectureModel.js";

dotenv.config();

async function lockAllLectures() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const res = await lectureModel.updateMany({}, { 
      isLocked: true,
      isPreviewFree: false 
    });
    console.log(`Locked ${res.modifiedCount} lectures successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("Lock failed:", error);
    process.exit(1);
  }
}

lockAllLectures();
