// pages/index.tsx
import React from 'react';
import Head from 'next/head';
import { Play, ArrowRight, Heart, Users, Award, Clock } from 'lucide-react';
import Header from './layouts/Header';
import HeroSection from './sections/HeroSection';
import ServicesPreview from './sections/SevicesPreview';
import StartsSection from './sections/StartsSection';
import Foodter from './layouts/Foodter';

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

                <Header />
                <HeroSection />
                <StartsSection />
                <ServicesPreview />

                <Foodter />
            </div>
        </>
    );
};

export default HomePage;