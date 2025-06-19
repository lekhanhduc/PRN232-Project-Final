'use client'
import React from 'react';
import DoctorCard from './DoctorCard';
import { Doctor } from './data/doctorData';

interface DoctorsGridProps {
    doctors: Doctor[];
}

const DoctorsGrid: React.FC<DoctorsGridProps> = ({ doctors }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
        </div>
    );
};

export default DoctorsGrid;