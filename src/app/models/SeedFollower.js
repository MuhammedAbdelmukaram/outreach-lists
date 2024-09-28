// src/models/SeedFollower.js
import mongoose from 'mongoose';

const SeedFollowerSchema = new mongoose.Schema({
    href: { type: String, required: true },
    value: { type: String, required: true },
    timestamp: { type: Number, required: true }
});

const SeedFollower = mongoose.models.SeedFollower || mongoose.model('SeedFollower', SeedFollowerSchema);
export default SeedFollower;