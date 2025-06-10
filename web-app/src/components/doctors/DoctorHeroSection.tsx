'use client'
import React from 'react';
import { DoctorAvatar } from './DoctorAvatar';
import { DoctorBasicInfo } from './DoctorBasicInfo';
import { DoctorStats } from './DoctorStats';
import { DoctorActionButtons } from './DoctorActionButtons';
import { DoctorData } from '@/types/doctor';

interface DoctorHeroSectionProps {
    doctor: DoctorData;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

export const DoctorHeroSection: React.FC<DoctorHeroSectionProps> = ({
    doctor,
    isFavorite,
    onToggleFavorite
}) => {
    const handleContact = () => {
        console.log('Contact doctor');
    };

    const handleVideoCall = () => {
        console.log('Start video call');
    };

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-transparent"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                    <DoctorAvatar
                        image={doctor.image}
                        name={doctor.name}
                        verified={doctor.verified}
                    />

                    <div className="flex-1">
                        <DoctorBasicInfo
                            name={doctor.name}
                            title={doctor.title}
                            qualifications={doctor.qualifications}
                            featured={doctor.featured}
                        />

                        <DoctorStats
                            rating={doctor.rating}
                            reviews={doctor.reviews}
                            totalPatients={doctor.totalPatients}
                            successRate={doctor.successRate}
                        />

                        <DoctorActionButtons
                            isFavorite={isFavorite}
                            onToggleFavorite={onToggleFavorite}
                            onContact={handleContact}
                            onVideoCall={handleVideoCall}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};