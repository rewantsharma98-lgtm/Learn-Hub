import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    thumbnail: String,
    category: String,
    level: String,
    hours: Number,
    creator: mongoose.Schema.Types.ObjectId,
    lectures: Array
}, { timestamps: true });

const courseModel = mongoose.model('course', courseSchema);

const SAMPLE_COURSES = [
    {
        title: "Fullstack Web Development with React & Node",
        description: "Master modern web development from scratch. Learn React, Node.js, Express, and MongoDB in this comprehensive bootcamp.",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        category: "Web Development",
        level: "Beginner",
        hours: 45,
    },
    {
        title: "Advanced UI/UX Design Masterclass",
        description: "Deep dive into user interface and experience design. Learn Figma, prototyping, and design systems for elite digital products.",
        thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?w=800&q=80",
        category: "Design",
        level: "Advanced",
        hours: 32,
    },
    {
        title: "Python for Data Science & Machine Learning",
        description: "Unlock the power of data. Learn Python, Pandas, Scikit-Learn, and build real-world machine learning models.",
        thumbnail: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80",
        category: "Data Science",
        level: "Intermediate",
        hours: 58,
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB...");
        
        await courseModel.deleteMany({}); // Clear old data if any
        console.log("Cleared old courses.");
        
        await courseModel.insertMany(SAMPLE_COURSES);
        console.log("Sample courses seeded successfully!");
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
