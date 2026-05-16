import mongoose from "mongoose";
import dotenv from "dotenv";
import courseModel from "./model/CourseModel.js";

dotenv.config();

async function configurePhysicsAccess() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // 1. Unlock Applied Physics-II and make it accessible to everyone
    const res = await courseModel.updateOne(
      { title: "Applied Physics-II" },
      { 
        isLocked: false, 
        targetDepartment: "All", 
        targetSemester: "All" 
      }
    );

    if (res.matchedCount === 0) {
      console.log("Applied Physics-II not found. Checking for variations...");
      // Try to find any course with Physics in the title
      const anyPhysics = await courseModel.findOne({ title: /Physics/i });
      if (anyPhysics) {
        await courseModel.updateOne(
          { _id: anyPhysics._id },
          { isLocked: false, targetDepartment: "All", targetSemester: "All" }
        );
        console.log(`Unlocked: ${anyPhysics.title}`);
      }
    } else {
      console.log("Successfully unlocked Applied Physics-II for all students.");
    }

    // 2. Ensure all other courses remain locked
    const lockedRes = await courseModel.updateMany(
      { title: { $ne: "Applied Physics-II" } },
      { isLocked: true }
    );
    console.log(`Verified lock for ${lockedRes.modifiedCount} other courses.`);

    process.exit(0);
  } catch (error) {
    console.error("Configuration failed:", error);
    process.exit(1);
  }
}

configurePhysicsAccess();
