import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import SeedFollower from '@/app/models/SeedFollower';
import SeedUploadHistory from '@/app/models/SeedUploadHistory';


export const revalidate = 0;
export async function GET() {
    try {
        await dbConnect();

        // Fetch the latest seed followers and upload metadata
        const seedFollowers = await SeedFollower.find({});
        const latestUpload = await SeedUploadHistory.findOne({}).sort({ createdAt: -1 });

        if (!seedFollowers || !latestUpload) {
            return NextResponse.json({ success: false, message: 'No seed followers or upload history found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            seedFollowers,
            latestUpload: {
                fileName: latestUpload.fileName,
                uploadTime: latestUpload.uploadTime,
            },
        });
    } catch (error) {
        console.error('Error fetching seed followers:', error);
        return NextResponse.json({ success: false, message: 'Server Error', error }, { status: 500 });
    }
}
