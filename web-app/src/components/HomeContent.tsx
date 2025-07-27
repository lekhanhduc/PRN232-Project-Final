'use client'
import React from 'react';
import Head from 'next/head';
import HeroSection from './sections/HeroSection';
import ServicesPreview from './sections/SevicesPreview';
import StartsSection from './sections/StartsSection';
import FeaturedDoctorsSection from './sections/FeaturedDoctorsSection';

const HomePage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Medically - Helping People Lead Healthy & Happy Lives</title>
                <meta name="description" content="Professional medical services to help you lead a healthy and happy life" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
                <HeroSection />
                <StartsSection />
                <FeaturedDoctorsSection />
                <ServicesPreview />
            </div>
        </>
    );
};

export default HomePage;