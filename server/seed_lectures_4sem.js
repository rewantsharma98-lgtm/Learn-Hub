import mongoose from "mongoose";
import dotenv from "dotenv";
import courseModel from "./model/CourseModel.js";
import SectionModel from "./model/SectionModel.js";
import lectureModel from "./model/LectureModel.js";

dotenv.config();

const youtubePlaceholders = [
  "https://youtu.be/1sSKNU4FTa4?si=FFqVULhwuK8ul-AD",
  "https://www.youtube.com/live/E0NbT1MNZdU?si=wL6-cAsrMADaDGAN",
  "https://youtu.be/J_B2snbfhY0?si=F6pRKvcUsptEhMcM",
  "https://youtu.be/IqG3ChCU-JY?si=Zu6GUBx6oQoOxun9",
  "https://www.youtube.com/live/p8nBK-LZOYM?si=ffBfuM3MG_bhhmnI" // One Shot
];

const dummyPdf = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

async function seedLectures() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const courses = await courseModel.find({ targetSemester: "4" }).populate("sections");
    console.log(`Found ${courses.length} courses for Semester 4`);

    for (const course of courses) {
      console.log(`Processing course: ${course.title}`);
      
      for (const section of course.sections) {
        if (section.lectures && section.lectures.length > 0) {
          console.log(`  Skipping ${section.title} (already has lectures)`);
          continue;
        }
        console.log(`  Adding lectures for section: ${section.title}`);
        
        const lectureIds = [];
        for (let i = 1; i <= 5; i++) {
          const isOneShot = (i === 5);
          const title = isOneShot 
            ? `${section.title} - One Shot Revision`
            : `${section.title} - Lecture ${i}`;
          
          const description = isOneShot
            ? `Complete one-shot revision for ${section.title}.`
            : `Detailed explanation of ${section.title} concepts part ${i}.`;

          const newLecture = new lectureModel({
            title,
            description,
            videoUrl: youtubePlaceholders[i - 1],
            order: i,
            unitTitle: section.title,
            course: course._id,
            resources: [
              {
                title: "Lecture Notes (PDF)",
                fileUrl: dummyPdf
              }
            ],
            notes: `### ${title}\n\nThis lecture covers the key concepts of **${section.title}**.\n\n- **Objective**: Understanding the core principles.\n- **Content**: Detailed walkthrough and examples.\n- **Revision**: Summary of important points.\n\nDownload the attached PDF for full notes.`
          });

          const savedLecture = await newLecture.save();
          lectureIds.push(savedLecture._id);
        }

        section.lectures = lectureIds;
        await section.save();
      }
      
      console.log(`Finished ${course.title}`);
    }

    console.log("Lectures seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedLectures();
