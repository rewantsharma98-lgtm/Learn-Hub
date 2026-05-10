import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure unique enrollment per user-course
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const EnrollmentModel = mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);

export default EnrollmentModel;
