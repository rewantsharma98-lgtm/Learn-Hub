import mongoose from "mongoose";

const downloadLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    email: { type: String, required: true },
    fileName: { type: String, required: true },
    ipAddress: { type: String },
    location: {
        lat: { type: Number },
        long: { type: Number }
    },
    timestamp: { type: Date, default: Date.now }
});

const downloadLogModel = mongoose.models.downloadLog || mongoose.model('downloadLog', downloadLogSchema);
export default downloadLogModel;
