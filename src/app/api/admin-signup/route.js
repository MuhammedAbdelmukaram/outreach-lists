import dbConnect from "@/app/lib/dbConnect";
import Admin from "@/app/models/admin";

export const revalidate = 0;
export async function POST(request) {

    await dbConnect();

    try {
        const { email, password } = await request.json();

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return new Response(JSON.stringify({ message: "Admin already exists." }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const admin = new Admin({ email, password });
        await admin.save();

        return new Response(JSON.stringify({ success: true, message: "Admin created successfully." }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('An error occurred while creating the admin:', error);
        return new Response(JSON.stringify({ message: "An error occurred on the server." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
