'use client'
import React from 'react';
import { Shield } from 'lucide-react';

interface DoctorAvatarProps {
    image: string;
    name: string;
    verified: boolean;
}

export const DoctorAvatar: React.FC<DoctorAvatarProps> = ({ image, name, verified }) => {
    return (
        <div className="relative">
            <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-sm">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>
            {verified && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                </div>
            )}
        </div>
    );
};