"use client"
import { useState, useEffect } from 'react';

export default function ArchivedBatches() {
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        async function fetchBatches() {
            const response = await fetch('/api/archived-batches');
            const data = await response.json();
            if (data.success) {
                setBatches(data.batches);
            }
        }

        fetchBatches();
    }, []);

    return (
        <div>
            <h1>Archived New Follower Batches</h1>
            {batches.map((batch, index) => (
                <div key={index}>
                    <h2>Batch created at: {new Date(batch.createdAt).toLocaleString()}</h2>
                    <pre>{JSON.stringify(batch.followers, null, 2)}</pre>
                </div>
            ))}
        </div>
    );
}
