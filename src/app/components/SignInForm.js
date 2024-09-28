"use client";
import React, {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from "next/navigation";

const SignInForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [token, setToken] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        }
    }, [searchParams]);

    const markTokenAsUsed = async (token, email) => {
        try {
            const response = await fetch('/api/mark-token-used', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, email })
            });
            const data = await response.json();
            console.log(data.message);  // Log the response from the server
        } catch (error) {
            console.error('Error marking token as used:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!termsAccepted) {
            setError("You must accept the terms of service to sign in.");
            return;
        }

        try {
            const response = await fetch("/api/signup/affiliate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Signed in successfully!");
                setError("");

                await markTokenAsUsed(token, email);
                // Redirect to admin panel
                router.push("/download-app");
            } else {
                setError(data.message || "Failed to sign in. Please try again.");
                setSuccess("");
            }
        } catch (err) {
            console.error("Sign in error:", err);
            setError("An error occurred during sign in.");
            setSuccess("");
        }
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 30 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label htmlFor="username" style={{ fontSize: 12 }}>Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        style={{
                            color: 'black',
                            width: '282px',
                            borderRadius: '6px',
                            background: '#fff',
                            border: '1px solid white',
                            padding: '10px',
                            marginBottom: '10px',
                        }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label htmlFor="email" style={{ fontSize: 12 }}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        style={{
                            color: 'black',
                            width: '282px',
                            borderRadius: '6px',
                            background: '#fff',
                            border: '1px solid white',
                            padding: '10px',
                            marginBottom: '10px',
                        }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label htmlFor="password" style={{ fontSize: 12 }}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        style={{
                            color: 'black',
                            width: '282px',
                            borderRadius: '6px',
                            background: '#fff',
                            border: '1px solid white',
                            padding: '10px',
                            marginBottom: '10px',
                        }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '10px' }}>
                    <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                    />
                    <label htmlFor="terms" style={{ fontSize: 12, cursor: 'pointer' }}>I accept the terms of service</label>
                </div>

                <div
                    style={{
                        width: '282px',
                        height: '1px',
                        backgroundColor: 'white',
                        marginBottom: '50px',
                    }}
                ></div>

                <button
                    type="submit"
                    style={{
                        color: '#0e0e0e',
                        width: '282px',
                        borderRadius: '100px',
                        backgroundColor: "#fff",
                        border: '1px solid white',
                        padding: '10px',
                        fontSize: 12,
                        cursor: 'pointer',
                    }}
                >
                    Create Account
                </button>
            </form>
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default SignInForm;
