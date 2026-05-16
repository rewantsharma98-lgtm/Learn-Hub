import mongoose from "mongoose";
import dotenv from "dotenv";
import courseModel from "./model/CourseModel.js";

dotenv.config();

const updates = {
  "Hydraulics": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&q=80",
  "Advanced Surveying": "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=800&q=80",
  "Theory of Structure": "https://images.unsplash.com/photo-1503387762-592dea58f230?w=800&q=80",
  "Geotechnical Engineering": "https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800&q=80",
  "Design of RCC and Steel Structure": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
  "Precast and Prestressed Concrete (Elective)": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
  "Rural Construction Technology (Elective)": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
};

async function updateThumbnails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const [title, url] of Object.entries(updates)) {
      const res = await courseModel.updateOne({ title }, { thumbnail: url });
      console.log(`Updated ${title}: ${res.modifiedCount} documents`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Update failed:", error);
    process.exit(1);
  }
}

updateThumbnails();
