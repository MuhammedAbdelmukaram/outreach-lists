import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import NewFollowerBatch from '@/app/models/NewFollowerBatch';

export async function GET() {
    try {
        await dbConnect();

        const batches = await NewFollowerBatch.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            batches
        });
    } catch (error) {
        console.error('Error retrieving batches:', error);
        return NextResponse.json({
            success: false,
            message: 'An error occurred while fetching batches',
        });
    }
}
