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
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent mix-blend-overlay"></div>

            <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.8" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="1"/%3E%3C/g%3E%3C/svg%3E")' }}>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                    <div className="backdrop-blur-sm bg-white/10 p-6 rounded-2xl border border-white/10 shadow-xl">
                        <DoctorAvatar
                            image={doctor.image}
                            name={doctor.name}
                            verified={doctor.verified}
                        />
                    </div>

                    <div className="flex-1 space-y-8">
                        <DoctorBasicInfo
                            name={doctor.name}
                            title={doctor.title}
                            qualifications={doctor.qualifications}
                            featured={doctor.featured}
                        />

                        <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10">
                            <DoctorStats
                                rating={doctor.rating}
                                reviews={doctor.reviews}
                                totalPatients={doctor.totalPatients}
                                successRate={doctor.successRate}
                            />
                        </div>

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