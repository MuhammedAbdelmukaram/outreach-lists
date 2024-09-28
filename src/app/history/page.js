"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FollowersPage = () => {
    const [batches, setBatches] = useState([]); // List of follower batches
    const [selectedBatch, setSelectedBatch] = useState(null); // Selected batch
    const [followers, setFollowers] = useState([]); // Followers of selected batch
    const [loading, setLoading] = useState(false); // Loading state for fetching data

    const router = useRouter();

    // Fetch follower batches on component mount
    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const response = await fetch("/api/get-follower-batches");
                const data = await response.json();
                if (data.success) {
                    setBatches(data.batches);
                } else {
                    console.error("Failed to fetch batches");
                }
            } catch (error) {
                console.error("Error fetching batches:", error);
            }
        };

        fetchBatches();
    }, []);

    const handleLogout = () => {
        // Clear the adminToken cookie by setting it with an expired date
        document.cookie = `adminToken=; path=/; max-age=0;`;
        // Redirect to the login page
        router.push("/login");
    };
    // Handle selecting a batch
    const handleBatchSelect = async (batchId) => {
        setSelectedBatch(batchId);
        setLoading(true);

        try {
            const response = await fetch(`/api/get-followers-by-batch?batchId=${batchId}`);
            const data = await response.json();

            if (data.success) {
                setFollowers(data.followers); // Set followers of the selected batch
            } else {
                console.error("Failed to fetch followers");
            }
        } catch (error) {
            console.error("Error fetching followers:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.logo}>
                    <Image src="/logo.png" alt="Logo" width={24} height={24} />
                </div>

                <div className={styles.logout} onClick={handleLogout}>
                    <Image
                        src="/logout.png"
                        alt="Logout"
                        width={24}
                        height={24}
                    />
                </div>
            </header>

            <div className={styles.container}>
                {/* Sidebar */}
                <div className={styles.sidebar}>
                    {/* Home Button */}
                    <div
                        className={styles.iconButton}
                        data-tooltip="Home"
                        onClick={() => router.push("/home")} // Navigate to /home
                    >
                        <Image src="/home.png" alt="Home" width={24} height={24} />
                    </div>

                    {/* History Button */}
                    <div
                        className={styles.iconButton}
                        data-tooltip="History"
                        onClick={() => router.push("/history")} // Navigate to /history
                    >
                        <Image src="/history.png" alt="History" width={24} height={24} />
                    </div>
                </div>

                {/* Main content */}
                <div className={styles.content}>
                    <h1>Select a Follower Batch</h1>
                    <div className={styles.batchList}>
                        {batches.length === 0 ? (
                            <p>No batches available</p>
                        ) : (
                            batches.map((batch) => (
                                <button
                                    key={batch._id}
                                    className={`${styles.batchButton} ${selectedBatch === batch._id ? styles.active : ""}`}
                                    onClick={() => handleBatchSelect(batch._id)}
                                >
                                    {new Date(batch.createdAt).toLocaleDateString()} - {new Date(batch.createdAt).toLocaleTimeString()}
                                </button>
                            ))
                        )}
                    </div>

                    {selectedBatch && (
                        <div className={styles.followerTableContainer}>
                            <h2>Followers for Selected Batch</h2>
                            {loading ? (
                                <p>Loading followers...</p>
                            ) : (
                                <table className={styles.followerTable}>
                                    <thead>
                                    <tr>
                                        <th>Username</th>

                                        <th>Timestamp</th> {/* Adding timestamp column */}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {followers.map((follower, index) => (
                                        <tr key={index}>
                                            <td>
                                                {/* Clickable name that navigates to the follower link */}
                                                <a href={follower.href} target="_blank" rel="noopener noreferrer">
                                                    {follower.value}
                                                </a>
                                            </td>

                                            <td>
                                                {/* Displaying timestamp */}
                                                {new Date(follower.timestamp * 1000).toLocaleDateString()} -{" "}
                                                {new Date(follower.timestamp * 1000).toLocaleTimeString()}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowersPage;
