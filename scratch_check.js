import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const courseSchema = new mongoose.Schema({
    title: String,
    category: String
}, { strict: false });

const Course = mongoose.model('course', courseSchema);

async function check() {
    try {
        console.log("URI:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Course.countDocuments();
        console.log("Total courses:", count);
        const courses = await Course.find();
        courses.forEach(c => console.log(`- ${c.title} [${c.category}]`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
