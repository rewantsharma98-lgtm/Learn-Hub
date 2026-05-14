import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({

    fileName: String,

    url: String,

    type: String,

    size: Number,

    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model(
    "Media",
    mediaSchema
);