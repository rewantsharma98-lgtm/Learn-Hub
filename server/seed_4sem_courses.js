import mongoose from "mongoose";
import dotenv from "dotenv";
import courseModel from "./model/CourseModel.js";
import SectionModel from "./model/SectionModel.js";

dotenv.config();

const adminId = "69ff8ecddd30f23e0cffa8d3";

const coursesData = [
  {
    title: "Computer Network",
    description: "Learn basic concepts of computer networks, hardware, ISO OSI and TCP/IP models.",
    category: "Computer Science & Technology",
    level: "Intermediate",
    hours: 45,
    targetSemester: "4",
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1000",
    sections: [
      { title: "Unit 1: Introduction to Data Communication Networking", order: 1 },
      { title: "Unit 2: Network Topologies and Networking Devices", order: 2 },
      { title: "Unit 3: Transmission Media", order: 3 },
      { title: "Unit 4: OSI & TCP/IP Reference Models", order: 4 },
      { title: "Unit 5: Multiplexing & Switching", order: 5 },
      { title: "Unit 6: Data Link Layer", order: 6 },
      { title: "Unit 7: Medium Access Sub Layer", order: 7 },
      { title: "Unit 8: Protocols, Services and Standards", order: 8 },
      { title: "Unit 9: Routing & IP Addressing", order: 9 },
      { title: "Unit 10: TCP/IP Fundamentals", order: 10 },
      { title: "Unit 11: Application Layer", order: 11 },
      { title: "Unit 12: Network Security & Cyber Security", order: 12 }
    ]
  },
  {
    title: "Relational Database Management System",
    description: "Study basic concepts of RDBMS, SQL, and PL/SQL in detail.",
    category: "Computer Science & Technology",
    level: "Intermediate",
    hours: 45,
    targetSemester: "4",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=1000",
    sections: [
      { title: "Unit 1: Database System Concept & Data Modeling", order: 1 },
      { title: "Unit 2: Relational Data Model, Security & Integrity", order: 2 },
      { title: "Unit 3: SQL and PL-SQL", order: 3 },
      { title: "Unit 4: Relational Database Design & Storage", order: 4 },
      { title: "Unit 5: Query Processing & Transaction Processing", order: 5 }
    ]
  },
  {
    title: "Object Oriented Programming (C++)",
    description: "Principles of OOP using C++, reusability, and software meeting new requirements.",
    category: "Computer Science & Technology",
    level: "Intermediate",
    hours: 45,
    targetSemester: "4",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1000",
    sections: [
      { title: "Unit 1: Concept of Object Oriented Programming", order: 1 },
      { title: "Unit 2: Objects & Classes", order: 2 },
      { title: "Unit 3: Constructors, Destructors, Function & Operator Overloading", order: 3 },
      { title: "Unit 4: Inheritance", order: 4 },
      { title: "Unit 5: Pointers in C++", order: 5 },
      { title: "Unit 6: Polymorphism", order: 6 },
      { title: "Unit 7: Exception Handling", order: 7 },
      { title: "Unit 8: Templates", order: 8 },
      { title: "Unit 9: I/O System & File Processing", order: 9 }
    ]
  },
  {
    title: "Computer Graphics",
    description: "Understand aspects of computer graphics, 3D graphics, and programming in C.",
    category: "Computer Science & Technology",
    level: "Intermediate",
    hours: 45,
    targetSemester: "4",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000",
    sections: [
      { title: "Unit 1: Basics of Computer Graphics", order: 1 },
      { title: "Unit 2: Line, Circle, and Polygon Algorithms", order: 2 },
      { title: "Unit 3: 2D & 3D Transformations", order: 3 },
      { title: "Unit 4: Windowing & Clipping", order: 4 },
      { title: "Unit 5: Curves (Bezier, B-Spline)", order: 5 },
      { title: "Unit 6: Projection", order: 6 }
    ]
  },
  {
    title: "Web Page Development",
    description: "Aesthetically appealing website design using HTML, XML, ASP, and VB Script.",
    category: "Computer Science & Technology",
    level: "Intermediate",
    hours: 30,
    targetSemester: "4",
    thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=1000",
    sections: [
      { title: "Unit 1: Internet Basics & Browsing", order: 1 },
      { title: "Unit 2: Web Server Configuration (IIS/PWS)", order: 2 },
      { title: "Unit 3: Internet Services (HTTP, FTP, Chat)", order: 3 },
      { title: "Unit 4: HTML & XML Fundamentals", order: 4 },
      { title: "Unit 5: Introduction to Active Server Pages (ASP)", order: 5 },
      { title: "Unit 6: VB Script Programming", order: 6 },
      { title: "Unit 7: Working with ASP & Server-side Scripts", order: 7 },
      { title: "Unit 8: ASP Session & Cookies", order: 8 },
      { title: "Unit 9: ASP Application Features", order: 9 },
      { title: "Unit 10: ASP Components", order: 10 },
      { title: "Unit 11: Database Management through ASP (ADO)", order: 11 }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const cData of coursesData) {
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

    console.log("Seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
