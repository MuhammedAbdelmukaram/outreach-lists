"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const HomePage = () => {
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token'); // Retrieve the JWT token from cookies

        if (!token) {
            // If the user is not authenticated, redirect to the login page
            router.push('/login');
        } else {
            // If authenticated, stay on /home
            router.push('/home');
        }
    }, [router]);

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
        </div>
    );
};

export default HomePage;
