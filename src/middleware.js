import { NextResponse } from 'next/server';

export async function middleware(req) {
    const token = req.cookies.get('adminToken'); // Get the token from cookies

    const url = req.nextUrl.clone();

    if (url.pathname.startsWith('/login')) {
        // Allow unauthenticated users to access the login page
        return NextResponse.next();
    }

    if (!token) {
        // If no token is found, redirect to the login page
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // If the token is found, allow access to the home page
    if (url.pathname === '/') {
        url.pathname = '/home'; // Redirect to home if the user is authenticated and hits the root path
        return NextResponse.redirect(url);
    }

    return NextResponse.next(); // Allow authenticated users to access other pages
}

export const config = {
    matcher: ['/home', '/', '/dashboard/:path*'], // Pages to apply the middleware to
};
