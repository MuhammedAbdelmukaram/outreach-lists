import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';
import dbConnect from '@/app/lib/dbConnect';
import SeedFollower from '@/app/models/SeedFollower';
import Follower from '@/app/models/Follower';
import NewFollowerBatch from '@/app/models/NewFollowerBatch';
import SeedUploadHistory from '@/app/models/SeedUploadHistory';

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? '', 'public/uploads');

export const revalidate = 0;
export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const targetCollection = formData.get('targetCollection');

        if (!file || !targetCollection) {
            return NextResponse.json({
                success: false,
                message: 'No file or target collection specified',
            });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        const filePath = path.resolve(UPLOAD_DIR, file.name);
        fs.writeFileSync(filePath, buffer);

        // Extract the zip file
        const zip = new AdmZip(filePath);
        const zipEntries = zip.getEntries();

        let jsonData = null;
        zipEntries.forEach(entry => {
            if (entry.entryName.includes('followers_1.json')) {
                const jsonContent = entry.getData().toString('utf8');
                jsonData = JSON.parse(jsonContent);
            }
        });

        fs.unlinkSync(filePath);

        if (!jsonData) {
            return NextResponse.json({
                success: false,
                message: 'followers_1.json not found in the zip file',
            });
        }

        await dbConnect();

        const followers = jsonData.map(item => item.string_list_data[0]).filter(data => data);

        if (targetCollection === 'seedFollowers') {
            await SeedFollower.deleteMany({});
            await SeedFollower.insertMany(followers, { ordered: false });

            const seedUpload = await SeedUploadHistory.create({
                fileName: file.name,
                uploadTime: new Date(),
            });

            return NextResponse.json({
                success: true,
                message: 'Seed followers uploaded',
                latestUpload: {
                    fileName: seedUpload.fileName,
                    uploadTime: seedUpload.uploadTime,
                    _id: seedUpload._id,
                },
            });
        } else if (targetCollection === 'followers') {
            const seedFollowers = await SeedFollower.find({});
            const seedHrefSet = new Set(seedFollowers.map(follower => follower.href));
            const newFollowers = followers.filter(follower => !seedHrefSet.has(follower.href));

            const latestSeedUpload = await SeedUploadHistory.findOne().sort({ uploadTime: -1 });

            if (newFollowers.length > 0) {
                await NewFollowerBatch.create({
                    followers: newFollowers,
                    seedUploadHistory: latestSeedUpload._id,
                });
            }

            await SeedFollower.deleteMany({});
            await SeedFollower.insertMany(followers, { ordered: false });

            const newSeedUpload = await SeedUploadHistory.create({
                fileName: file.name,
                uploadTime: new Date(),
            });

            return NextResponse.json({
                success: true,
                newFollowers,
                latestUpload: {
                    fileName: newSeedUpload.fileName,
                    uploadTime: newSeedUpload.uploadTime,
                    _id: newSeedUpload._id,
                },
            });
        }
    } catch (error) {
        console.error('Error during upload:', error);
        return NextResponse.json({
            success: false,
            message: 'An error occurred',
        });
    }
}
