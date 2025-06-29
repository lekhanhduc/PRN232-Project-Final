'use client'
import React from 'react';
import DoctorCard from './DoctorCard';
import { DoctorSearchResponse } from '@/types/doctor';

interface DoctorsGridProps {
    doctors: DoctorSearchResponse[];
}

const DoctorsGrid: React.FC<DoctorsGridProps> = ({ doctors }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
                <DoctorCard key={doctor.doctorId} doctor={doctor} />
            ))}
        </div>
    );
};

export default DoctorsGrid;