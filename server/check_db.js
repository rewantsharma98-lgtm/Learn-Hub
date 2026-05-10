import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const courseSchema = new mongoose.Schema({
    title: String,
});

const courseModel = mongoose.model('course', courseSchema);

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await courseModel.countDocuments();
    console.log("TOTAL COURSES IN DB:", count);
    const all = await courseModel.find();
    console.log("COURSES:", JSON.stringify(all, null, 2));
    process.exit(0);
}

check();
