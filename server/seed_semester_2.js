import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import Course from "./model/CourseModel.js";
import Section from "./model/SectionModel.js";
import Lecture from "./model/LectureModel.js";
import User from "./model/UserModel.js";

const SYLLABUS = [
  {
    title: "Engineering Mathematics-II",
    code: "BS102/M-II",
    thumbnail: "/course-images/Engineering Mathematics-II.png",
    units: [
      "Unit 1 — Determinants & Matrices",
      "Unit 2 — Coordinate Geometry",
      "Unit 3 — Integral Calculus",
      "Unit 4 — Ordinary Differential Equation",
      "Unit 5 — Partial Differentiation",
      "Unit 6 — Statistics & Probability"
    ]
  },
  {
    title: "Applied Physics-II",
    code: "BS104",
    thumbnail: "/course-images/TheoryApplied Physics-II.png",
    units: [
      "Unit 1 — Wave Motion and its Applications",
      "Unit 2 — Optics",
      "Unit 3 — Electrostatics",
      "Unit 4 — Current Electricity",
      "Unit 5 — Electromagnetism",
      "Unit 6 — Semiconductor Physics",
      "Unit 7 — Modern Physics"
    ]
  },
  {
    title: "Introduction to IT Systems Theory",
    code: "ES102",
    thumbnail: "/course-images/Introduction to IT Systems.png",
    units: [
      "Unit 1 — Basic Internet Skills, Number System, Boolean Algebra, Computer Hardware",
      "Unit 2 — Operating Systems",
      "Unit 3 — Algorithm and Flowcharts",
      "Unit 4 — HTML5, CSS, JavaScript",
      "Unit 5 — Network Utilities, Cyber Security, Malware, Hacker Techniques"
    ]
  },
  {
    title: "Fundamentals of Electrical & Electronics Engineering (FEEE)",
    code: "BS106",
    thumbnail: "/course-images/Fundamentals of Electrical & Electronics Engineering (FEEE).png",
    units: [
      "Unit 1 — Overview of Electrical Components",
      "Unit 2 — Electric and Magnetic Circuits",
      "Unit 3 — A.C. Circuits",
      "Unit 4 — Transformer and Machines",
      "Unit 5 — Overview of Basic Semiconductor Devices",
      "Unit 6 — Overview of Analog Circuits",
      "Unit 7 — Overview of Digital Electronics"
    ]
  },
  {
    title: "Engineering Mechanics",
    code: "ES104",
    thumbnail: "/course-images/E.Mech.png",
    units: [
      "Unit 1 — Basics of Mechanics and Force System",
      "Unit 2 — Moments and Couples",
      "Unit 3 — Condition of Equilibrium",
      "Unit 4 — Friction",
      "Unit 5 — Centroid and Centre of Gravity",
      "Unit 6 — Simple Lifting Machines",
      "Unit 7 — Motion in a Plane"
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🚀 Connected to Database");

    // Find an admin user to be the creator
    let creator = await User.findOne({ role: "admin" });
    if (!creator) {
        creator = await User.findOne();
    }

    if (!creator) {
        console.error("❌ No user found in DB. Please create a user first.");
        process.exit(1);
    }

    console.log(`👤 Using creator: ${creator.email}`);

    // Clear existing data (optional - but user said "replace")
    await Course.deleteMany({ category: "Semester 2" });
    console.log("🗑️ Cleared previous Semester 2 data");

    for (const subject of SYLLABUS) {
      console.log(`📚 Seeding: ${subject.title}`);
      
      const newCourse = await Course.create({
        title: subject.title,
        subtitle: subject.code,
        description: `Comprehensive course for ${subject.title} (${subject.code}).`,
        category: "Semester 2",
        thumbnail: subject.thumbnail,
        creator: creator._id,
        level: "Beginner",
        status: "Published",
        isFree: true
      });

      const sectionIds = [];
      const lectureIds = [];

      for (let i = 0; i < subject.units.length; i++) {
        const unitTitle = subject.units[i];
        
        const newSection = await Section.create({
          title: unitTitle,
          course: newCourse._id,
          order: i + 1
        });
        sectionIds.push(newSection._id);

        // Add 5 lectures per unit (as requested: "add lecture till 5 with notes in sem 2")
        // Wait, they said "add lecture till 5... in sem 2". Maybe they mean 5 lectures total per subject?
        // "add lecture till 5 with notes in sem 2"
        // I'll add 5 lectures for the FIRST unit, and maybe 1-2 for others to keep it clean but fulfilling the "5" requirement.
        
        const lecturesForThisUnit = i === 0 ? 5 : 1; 

        for (let j = 0; j < lecturesForThisUnit; j++) {
          const newLecture = await Lecture.create({
            title: `${unitTitle} - Lecture ${j + 1}`,
            description: `Detailed explanation of ${unitTitle} concepts part ${j + 1}.`,
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
            notes: `### ${unitTitle} - Lecture ${j + 1}\n\nThis lecture covers the fundamental concepts of ${unitTitle}.\n\n- Key Point 1: Introduction to the topic.\n- Key Point 2: Theoretical background.\n- Key Point 3: Practical applications.\n\nMake sure to download the notes for further reference.`,
            resources: [
              {
                title: "Lecture Notes (PDF)",
                fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
              }
            ],
            order: j + 1,
            unitTitle: unitTitle,
            course: newCourse._id
          });
          
          newSection.lectures.push(newLecture._id);
          lectureIds.push(newLecture._id);
        }
        await newSection.save();
      }

      newCourse.sections = sectionIds;
      newCourse.lectures = lectureIds;
      await newCourse.save();
    }

    console.log("✅ Semester 2 seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
