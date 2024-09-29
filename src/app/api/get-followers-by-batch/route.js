// src/app/api/get-followers-by-batch/route.js
import dbConnect from '@/app/lib/dbConnect';
import NewFollowerBatch from '@/app/models/NewFollowerBatch';

export const revalidate = 0;
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get('batchId');

    if (!batchId) {
        return new Response(JSON.stringify({ success: false, message: "Batch ID not provided" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        await dbConnect();
        const batch = await NewFollowerBatch.findById(batchId);

        if (!batch) {
            return new Response(JSON.stringify({ success: false, message: "Batch not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ success: true, followers: batch.followers }), {
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
