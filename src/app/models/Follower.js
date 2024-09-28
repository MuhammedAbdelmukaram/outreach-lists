// src/models/Follower.js
import mongoose from 'mongoose';

const FollowerSchema = new mongoose.Schema({
    href: { type: String, required: true },
    value: { type: String, required: true },
    timestamp: { type: Number, required: true }
});

const Follower = mongoose.models.Follower || mongoose.model('Follower', FollowerSchema);
export default Follower;
