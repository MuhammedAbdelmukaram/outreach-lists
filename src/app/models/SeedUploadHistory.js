import mongoose from 'mongoose';

const SeedUploadHistorySchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    uploadTime: {
        type: Date,
        required: true,
    },
}, { timestamps: true });  // This will add `createdAt` and `updatedAt` fields

export default mongoose.models.SeedUploadHistory || mongoose.model('SeedUploadHistory', SeedUploadHistorySchema);
