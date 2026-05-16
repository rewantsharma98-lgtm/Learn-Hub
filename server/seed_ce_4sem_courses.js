import mongoose from "mongoose";
import dotenv from "dotenv";
import courseModel from "./model/CourseModel.js";
import SectionModel from "./model/SectionModel.js";

dotenv.config();

const adminId = "69ff8ecddd30f23e0cffa8d3";

const ceCoursesData = [
  {
    title: "Hydraulics",
    description: "Understand fluid flow, hydrostatic pressure, head loss, and different types of pumps.",
    category: "Civil Engineering",
    level: "Intermediate",
    hours: 30,
    targetSemester: "4",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000",
    sections: [
      { title: "Unit 1: Pressure measurement and Hydrostatic pressure", order: 1 },
      { title: "Unit 2: Fluid Flow Parameters", order: 2 },
      { title: "Unit 3: Flow through Pipes", order: 3 },
      { title: "Unit 4: Flow through Open Channel", order: 4 },
      { title: "Unit 5: Hydraulic Pumps", order: 5 }
    ]
  },
  {
    title: "Advanced Surveying",
    description: "Theodolite surveying, Tacheometric Surveying, Curve Setting, Total station, Remote Sensing, GPS and GIS.",
    category: "Civil Engineering",
    level: "Intermediate",
    hours: 45,
    targetSemester: "4",
    thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000",
    sections: [
      { title: "Unit 1: Measurement of Area and Volume", order: 1 },
      { title: "Unit 2: Theodolite Surveying", order: 2 },
      { title: "Unit 3: Tacheometric Surveying and Curve Setting", order: 3 },
      { title: "Unit 4: Advanced Surveying Equipments", order: 4 },
      { title: "Unit 5: Remote Sensing, GPS and GIS", order: 5 }
    ]
  },
  {
    title: "Theory of Structure",
    description: "Buckling loads for columns, eccentric loading, slope deflection, three moment, and moment distribution methods.",
    category: "Civil Engineering",
    level: "Intermediate",
    hours: 45,
    targetSemester: "4",
    thumbnail: "https://images.unsplash.com/photo-1503387762-592dea58f230?auto=format&fit=crop&q=80&w=1000",
    sections: [
      { title: "Unit 1: Column Analysis", order: 1 },
      { title: "Unit 2: Direct and Bending Stresses in Vertical Members", order: 2 },
      { title: "Unit 3: Slope and Deflection", order: 3 },
      { title: "Unit 4: Fixed and Continuous Beam", order: 4 },
      { title: "Unit 5: Moment Distribution Method", order: 5 }
    ]
  },
  {
    title: "Geotechnical Engineering",
    description: "Physical properties of soil, permeability, shear strength, load bearing capacity, and soil exploration.",
    category: "Civil Engineering",
    level: "Intermediate",
    hours: 45,
    targetSemester: "4",
    thumbnail: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=1000",
    sections: [
      { title: "Unit 1: Overview of Geology and Geotechnical Engineering", order: 1 },
      { title: "Unit 2: Physical and Index Properties of Soil", order: 2 },
      { title: "Unit 3: Permeability and Shear Strength of Soil", order: 3 },
      { title: "Unit 4: Bearing Capacity of Soil and Earth Pressure", order: 4 },
      { title: "Unit 5: Compaction, Consolidation, Stabilization and Exploration", order: 5 }
    ]
  },
  {
    title: "Design of RCC and Steel Structure",
    description: "Design of RCC elements (beams, lintels) and steel connection design using Limit State Design.",
    category: "Civil Engineering",
    level: "Intermediate",
    hours: 45,
    targetSemester: "4",
    thumbnail: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=1000",
    sections: [
      { title: "Unit 1: Introduction to Structural Design", order: 1 },
      { title: "Unit 2: Analysis and Design of Reinforced Sections by LSM", order: 2 },
      { title: "Unit 3: Analysis and Design of T-Beam and Lintel by LSM", order: 3 },
      { title: "Unit 4: Introduction and Design of Steel Connections", order: 4 },
      { title: "Unit 5: Design Of Steel Beams by LSM", order: 5 }
    ]
  },
  {
    title: "Precast and Prestressed Concrete (Elective)",
    description: "Introduction to various types of precast elements and prestressing methods/systems.",
    category: "Civil Engineering",
    level: "Intermediate",
    hours: 45,
    targetSemester: "4",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000",
    sections: [
      { title: "Unit 1: Precast Concrete Elements", order: 1 },
      { title: "Unit 2: Prefabricated Building", order: 2 },
      { title: "Unit 3: Introduction to Prestressed Concrete", order: 3 },
      { title: "Unit 4: Methods and Systems of Prestressing", order: 4 },
      { title: "Unit 5: Analysis and Design of Prestressed Beams", order: 5 }
    ]
  },
  {
    title: "Rural Construction Technology (Elective)",
    description: "Development and planning of low cost housing, rural road construction, and irrigation techniques.",
    category: "Civil Engineering",
    level: "Intermediate",
    hours: 45,
    targetSemester: "4",
    thumbnail: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000",
    sections: [
      { title: "Unit 1: Rural Development and Planning", order: 1 },
      { title: "Unit 2: Rural Housing & Low Cost Materials", order: 2 },
      { title: "Unit 3: Water Supply and Sanitation for Rural Areas", order: 3 },
      { title: "Unit 4: Low Cost Rural Roads", order: 4 },
      { title: "Unit 5: Low Cost Irrigation", order: 5 }
    ]
  }
];

async function seedCE() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const cData of ceCoursesData) {
      const { sections, ...courseInfo } = cData;
      
      const newCourse = new courseModel({
        ...courseInfo,
        creator: adminId,
        enrolledStudents: []
      });

      const savedCourse = await newCourse.save();
      console.log(`Created course: ${savedCourse.title}`);

      const sectionIds = [];
      for (const sData of sections) {
        const newSection = new SectionModel({
          ...sData,
          course: savedCourse._id,
          lectures: []
        });
        const savedSection = await newSection.save();
        sectionIds.push(savedSection._id);
      }

      savedCourse.sections = sectionIds;
      await savedCourse.save();
      console.log(`Added ${sectionIds.length} sections to ${savedCourse.title}`);
    }

    console.log("CE Seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("CE Seeding failed:", error);
    process.exit(1);
  }
}

seedCE();
