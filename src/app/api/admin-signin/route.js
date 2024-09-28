import dbConnect from "@/app/lib/dbConnect";
import Admin from "@/app/models/admin";
import { SignJWT } from 'jose';
import { TextEncoder } from 'util';
import bcrypt from 'bcrypt';

export async function POST(request) {
    await dbConnect();

    try {
        const { email, password } = await request.json();

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return new Response(JSON.stringify({ message: "Invalid email or password." }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const comparePassword = async (candidatePassword, hashedPassword) => {
            return bcrypt.compare(candidatePassword, hashedPassword);
        };

        const isMatch = await comparePassword(password, admin.password);
        if (!isMatch) {
            return new Response(JSON.stringify({ message: "Invalid email or password." }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ id: admin._id })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('72h')
            .sign(secret);

        return new Response(JSON.stringify({ token, admin: { id: admin._id, email: admin.email } }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('An error occurred while signing in:', error);
        return new Response(JSON.stringify({ message: "An error occurred on the server." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
