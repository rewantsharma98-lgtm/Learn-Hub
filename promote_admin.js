import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const userSchema = new mongoose.Schema({
    email: String,
    role: String
}, { strict: false });

const User = mongoose.model('user', userSchema);

async function promote() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const email = "rewantsharma56@gmail.com";
        const user = await User.findOneAndUpdate(
            { email }, 
            { role: "admin" }, 
            { new: true }
        );
        
        if (user) {
            console.log(`✅ Success: ${email} has been promoted to ADMIN.`);
        } else {
            console.log(`❌ Error: User ${email} not found. Please register first.`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

promote();
