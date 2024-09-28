"use client"
import React, { useState } from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import AdminSignUpForm from "@/app/components/AdminSignUpForm";
import { motion } from "framer-motion";
import AdminSignInForm from "@/app/components/AdminSignInForm";

const Home = () => {
    const [view, setView] = useState('home');

    const handleDeveloperClick = () => {
        setView('developer');
    };

    const handleSaaSClick = () => {
        setView('saas');
    };


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3 }}
        >

            <main className={styles.main}>


                <div className={styles.mainWrapper}>
                    {/* Logo */}
                    <div className={styles.logo}>
                        <Image src="/logo.png" alt="Logo" width={230} height={230} />
                    </div>

                    <AdminSignInForm />
                </div>
                {/* Footer */}

            </main>
        </motion.div>
    );
};

export default Home;
