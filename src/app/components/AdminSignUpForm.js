"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

const AdminSignUpForm = ({signin}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("/api/admin-signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({  email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Admin created successfully!");
                setError("");
                setEmail("");
                setPassword("");

                setTimeout(() => {
                    router.push("/admin-signin");
                }, 2000); // Redirect after 2 seconds
            } else {
                setError(data.message || "Failed to sign up. Please try again.");
                setSuccess("");
            }
        } catch (err) {
            console.error("Sign up error:", err);
            setError("An error occurred during sign up.");
            setSuccess("");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 30 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
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

export default AdminSignUpForm;
