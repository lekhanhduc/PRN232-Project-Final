'use client'
import React from 'react';

interface DoctorBasicInfoProps {
    name: string;
    title: string;
    qualifications: string;
    featured: boolean;
}

export const DoctorBasicInfo: React.FC<DoctorBasicInfoProps> = ({
    name,
    title,
    qualifications,
    featured
}) => {
    return (
        <div>
            <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl lg:text-5xl font-bold text-white">{name}</h1>
                {featured && (
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                    </span>
                )}
            </div>
            <p className="text-xl text-blue-100 mb-2">{title}</p>
            <p className="text-lg text-blue-200 mb-4">{qualifications}</p>
        </div>
    );
};