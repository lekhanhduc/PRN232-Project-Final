'use client';
import { Doctor, doctors, specialties } from '@/components/doctors/data/doctorData';
import { DoctorSearchResponse } from '@/types/doctor';
import DoctorSearchBar from '@/components/doctors/DoctorSearchBar';
import DoctorsGrid from '@/components/doctors/DoctorsGrid';
import PageHeader from '@/components/doctors/PageHeader';
import PageNavigation from '@/components/doctors/PageNavigation';
import ResultsCounter from '@/components/doctors/ResultsCounter';
import SpecialtySelector from '@/components/doctors/SpecialtySelector';
import React, { useState } from 'react';

const ITEMS_PER_PAGE = 6;

// Transform mock Doctor data to DoctorSearchResponse format
const transformDoctorData = (doctor: Doctor): DoctorSearchResponse => {
    return {
        doctorId: doctor.id,
        fullName: doctor.name,
        academicTitle: 'Dr.', // Default title since not available in mock data
        specialty: {
            specialtyId: 1, // Default ID since not available in mock data
            specialtyName: doctor.specialty
        },
        gender: undefined, // Not available in mock data
        yearsOfExperience: parseInt(doctor.experience.split(' ')[0]) || 0,
        consultationFee: 500000, // Default fee since not available in mock data
        bio: `Experienced ${doctor.specialty} with ${doctor.experience} of practice.`,
        workSchedules: [] // Empty array since not available in mock data
    };
};

const DoctorsList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Transform all doctors to DoctorSearchResponse format
    const transformedDoctors: DoctorSearchResponse[] = doctors.map(transformDoctorData);

    const filteredDoctors: DoctorSearchResponse[] = transformedDoctors.filter((doctor: DoctorSearchResponse) => {
        const matchesSearch =
            doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.specialtyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty.specialtyName === selectedSpecialty;
        return matchesSearch && matchesSpecialty;
    });

    const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <PageHeader />
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
                    <div className="flex flex-col md:flex-row gap-6">
                        <DoctorSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        <SpecialtySelector
                            selectedSpecialty={selectedSpecialty}
                            setSelectedSpecialty={setSelectedSpecialty}
                            specialties={specialties}
                        />
                    </div>
                </div>
                <ResultsCounter count={filteredDoctors.length} />
                <DoctorsGrid doctors={paginatedDoctors} />
                <PageNavigation
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={(page: number) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            </div>
        </div>
    );
};

export default DoctorsList;