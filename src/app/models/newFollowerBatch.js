// src/models/NewFollowerBatch.js
import mongoose from 'mongoose';

const NewFollowerBatchSchema = new mongoose.Schema({
    followers: [{
        href: { type: String, required: true },
        value: { type: String, required: true },
        timestamp: { type: Number, required: true }
    }],
    createdAt: { type: Date, default: Date.now },
    seedUploadHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SeedUploadHistory', // Reference to the SeedUploadHistory model
        required: true
    }
});

const NewFollowerBatch = mongoose.models.NewFollowerBatch || mongoose.model('NewFollowerBatch', NewFollowerBatchSchema);
export default NewFollowerBatch;
