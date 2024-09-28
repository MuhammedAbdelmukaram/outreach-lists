"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { formatDistanceToNow } from "date-fns";
import Image from 'next/image';
import { useRouter } from "next/navigation";

export default function Home() {
    const [seedFollowers, setSeedFollowers] = useState([]); // Store seed followers
    const [newFollowers, setNewFollowers] = useState([]); // Store new followers (difference)
    const [seedUploaded, setSeedUploaded] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const [uploadedTime, setUploadedTime] = useState(null);

    const router = useRouter();

    const handleLogout = () => {
        // Clear the adminToken cookie by setting it with an expired date
        document.cookie = `adminToken=; path=/; max-age=0;`;
        // Redirect to the login page
        router.push("/login");
    };

    // Fetch seed followers on component mount
    const fetchSeedFollowers = async () => {
        try {
            const response = await fetch("/api/get-seed-followers");
            if (response.ok) {
                const data = await response.json();
                if (data.success) {

                    setSeedFollowers(data.seedFollowers);
                    setUploadedFileName(data.latestUpload.fileName);
                    setUploadedTime(new Date(data.latestUpload.uploadTime));
                    setSeedUploaded(true);
                }
            } else {
                console.error("Failed to fetch seed followers");
            }
        } catch (error) {
            console.error("Error fetching seed followers:", error);
        }
    };

    useEffect(() => {
        fetchSeedFollowers(); // Fetch data on component mount
    }, []);

    // Handle file uploads
    // Handle file uploads
    // Handle file uploads
// Handle file uploads
    const handleFileChange = async (event, targetCollection) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("targetCollection", targetCollection);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Uploaded followers data:", data);

            // Ensure this part correctly updates the fileName and uploadTime
            if (data.latestUpload) {
                setUploadedFileName(data.latestUpload.fileName);  // Set latest file name
                setUploadedTime(new Date(data.latestUpload.uploadTime));  // Set latest upload time
                setSeedUploaded(true);  // Mark the seed as uploaded
            }

            // Handle the followers list if this is a "followers" upload
            if (targetCollection === "followers" && Array.isArray(data.newFollowers)) {
                const followersList = data.newFollowers.map(item => ({
                    href: item.href,
                    value: item.value,
                    timestamp: item.timestamp,
                }));

                const newFollowersList = followersList.filter(follower =>
                    !seedFollowers.some(seed => seed.value === follower.value)
                );

                setNewFollowers(newFollowersList);  // Update new followers
            }

            // Fetch the updated seed followers after the upload to ensure the UI reflects changes
            //fetchSeedFollowers();  // Refresh the seed followers after the move
        } else {
            console.error("Upload failed");
        }
    };




    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.logo}>
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={24}
                        height={24}
                    />
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
                        onClick={() => router.push("/home")}
                    >
                        <Image
                            src="/home.png"
                            alt="Home"
                            width={24}
                            height={24}
                        />
                    </div>

                    {/* History Button */}
                    <div
                        className={styles.iconButton}
                        data-tooltip="History"
                        onClick={() => router.push("/history")}
                    >
                        <Image
                            src="/history.png"
                            alt="History"
                            width={24}
                            height={24}
                        />
                    </div>
                </div>

                {/* Main content */}
                <div className={styles.content}>
                    {/* Uploads */}
                    <div className={styles.buttonRow}>
                        {/* Upload Seed Followers */}
                        <div className={`${styles.uploadSection} ${seedUploaded ? styles.uploaded : ''}`}>
                            {seedUploaded ? (
                                <div>
                                    <p className={styles.buttonHeading}>Upload new</p>
                                    <div className={styles.fileInfoContainer}>
                                        <div className={styles.fileIcon}>JSON</div>
                                        <div className={styles.fileDetails}>
                                            <p className={styles.fileName}>{uploadedFileName}</p>
                                            <p className={styles.fileDate}>
                                                {uploadedTime?.toLocaleDateString()} –{" "}
                                                <span className={styles.time}>{uploadedTime?.toLocaleTimeString()}</span>
                                            </p>
                                        </div>
                                        <div className={styles.timeAgo}>
                                            Uploaded{" "}
                                            {uploadedTime &&
                                                formatDistanceToNow(new Date(uploadedTime), {
                                                    addSuffix: true,
                                                })}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className={styles.buttonHeading}>Upload to Seed Followers</p>
                                    <label htmlFor="seedUpload" className={styles.uploadButton}>
                                        Upload ZIP
                                        <input
                                            id="seedUpload"
                                            type="file"
                                            name="file"
                                            accept=".zip"
                                            onChange={(e) => handleFileChange(e, "seedFollowers")}
                                            className={styles.hiddenInput}
                                        />
                                    </label>
                                </>
                            )}
                        </div>

                        {/* Upload Followers */}
                        <div className={styles.uploadSection}>
                            <p className={styles.buttonHeading}>Upload new</p>
                            <label htmlFor="followersUpload" className={styles.uploadButton}>
                                Upload ZIP
                                <input
                                    id="followersUpload"
                                    type="file"
                                    name="file"
                                    accept=".zip"
                                    onChange={(e) => handleFileChange(e, "followers")}
                                    className={styles.hiddenInput}
                                />
                            </label>
                        </div>
                    </div>

                    <div style={{border:"1px solid #fff"}}></div>

                    {/* New Followers List */}
                    <div className={styles.followerList}>
                        <h3 className={styles.listHeading}>
                            <span className={styles.listTitle}>Generated list</span>
                        </h3>

                        <div className={styles.followerStats}>
                            <span className={styles.newFollowersCount}>
                                {newFollowers.length} New Followers
                            </span>
                        </div>

                        {/* Table for followers */}
                        <div className={styles.tableContainer}>
                            <table className={styles.followerTable}>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>USERNAME</th>
                                    <th>TIMESTAMP</th>
                                </tr>
                                </thead>
                                <tbody>
                                {newFollowers.map((follower, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input type="checkbox" className={styles.checkbox} />
                                        </td>
                                        <td>
                                            <a
                                                href={follower.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.usernameLink}
                                            >
                                                {follower.value}
                                            </a>
                                        </td>
                                        <td>
                                            {new Date(follower.timestamp * 1000).toLocaleDateString()}{" "}
                                            -{" "}
                                            {new Date(follower.timestamp * 1000).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
