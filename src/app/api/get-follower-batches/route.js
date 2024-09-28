// src/app/api/get-follower-batches/route.js
import dbConnect from '@/app/lib/dbConnect';
import NewFollowerBatch from '@/app/models/NewFollowerBatch';

export async function GET(req) {
    try {
        await dbConnect();
        const batches = await NewFollowerBatch.find({}, { createdAt: 1 }); // Fetch only the createdAt field
        return new Response(JSON.stringify({ success: true, batches }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
