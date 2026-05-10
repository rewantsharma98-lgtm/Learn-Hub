import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    lastWatched: {
        type: Date,
        default: Date.now
    },
    studentNote: {
        type: String,
        default: ""
    }
});

// Unique progress record per user-lecture
progressSchema.index({ user: 1, lecture: 1 }, { unique: true });

const ProgressModel = mongoose.models.Progress || mongoose.model("Progress", progressSchema);

export default ProgressModel;
