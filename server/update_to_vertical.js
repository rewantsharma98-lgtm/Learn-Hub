import mongoose from "mongoose";
import dotenv from "dotenv";
import courseModel from "./model/CourseModel.js";

dotenv.config();

const verticalThumbnails = {
  "Computer Network": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=1200&fit=crop",
  "Relational Database Management System": "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=800&q=1200&fit=crop",
  "Object Oriented Programming (C++)": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=1200&fit=crop",
  "Computer Graphics": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=1200&fit=crop",
  "Web Page Development": "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=1200&fit=crop",
  "Hydraulics": "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=800&q=1200&fit=crop",
  "Advanced Surveying": "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=800&q=1200&fit=crop",
  "Theory of Structure": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=1200&fit=crop",
  "Geotechnical Engineering": "https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800&q=1200&fit=crop",
  "Design of RCC and Steel Structure": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=1200&fit=crop",
  "Precast and Prestressed Concrete (Elective)": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=1200&fit=crop",
  "Rural Construction Technology (Elective)": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=1200&fit=crop"
};

async function updateToVertical() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const [title, url] of Object.entries(verticalThumbnails)) {
      const res = await courseModel.updateOne({ title }, { thumbnail: url });
      console.log(`Updated ${title}: ${res.modifiedCount} documents`);
    }

    console.log("All thumbnails updated to vertical-first professional imagery.");
    process.exit(0);
  } catch (error) {
    console.error("Update failed:", error);
    process.exit(1);
  }
}

updateToVertical();
