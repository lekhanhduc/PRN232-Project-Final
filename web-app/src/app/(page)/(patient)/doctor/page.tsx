'use client';
import React, { useState, useEffect } from 'react';
import { useDoctors } from '@/hooks/useDoctors';
import { Gender } from '@/types/doctor';
import DoctorSearchBar from '@/components/doctors/DoctorSearchBar';
import DoctorsGrid from '@/components/doctors/DoctorsGrid';
import PageHeader from '@/components/doctors/PageHeader';
import PageNavigation from '@/components/doctors/PageNavigation';
import ResultsCounter from '@/components/doctors/ResultsCounter';
import SpecialtySelector from '@/components/doctors/SpecialtySelector';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const DoctorsList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
    const [selectedGender, setSelectedGender] = useState<Gender | undefined>(undefined);
    const [isAvailable, setIsAvailable] = useState<boolean | undefined>(undefined);

    const {
        doctors,
        loading,
        error,
        currentPage,
        totalPages,
        totalElements,
        searchDoctors,
        setCurrentPage
    } = useDoctors();

    // Effect: Reset page to 1 when any filter/search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedSpecialty, selectedGender, isAvailable]);

    // Effect: Fetch doctors when currentPage or filters change
    useEffect(() => {
        const params: any = {};
        if (searchTerm.trim()) params.doctorName = searchTerm.trim();
        if (selectedSpecialty !== 'All') params.specialtyName = selectedSpecialty;
        if (selectedGender) params.gender = selectedGender;
        if (isAvailable !== undefined) params.isAvailable = isAvailable;
        searchDoctors(params);
    }, [searchTerm, selectedSpecialty, selectedGender, isAvailable, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <PageHeader />
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tìm kiếm bác sĩ</h3>
                        <p className="text-gray-600">Tìm kiếm theo tên bác sĩ hoặc lọc theo chuyên khoa, giới tính và tình trạng có sẵn</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                        <DoctorSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        <SpecialtySelector
                            selectedSpecialty={selectedSpecialty}
                            setSelectedSpecialty={setSelectedSpecialty}
                            specialties={['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Internal Medicine', 'Surgery', 'Psychiatry', 'Ophthalmology']}
                        />
                    </div>

                    {/* Additional filters */}
                    <div className="flex flex-wrap gap-4 mt-6">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Gender:</label>
                            <select
                                value={selectedGender || ''}
                                onChange={(e) => setSelectedGender(e.target.value ? e.target.value as Gender : undefined)}
                                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                            >
                                <option value="">All</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Availability:</label>
                            <select
                                value={isAvailable === undefined ? '' : isAvailable.toString()}
                                onChange={(e) => setIsAvailable(e.target.value === '' ? undefined : e.target.value === 'true')}
                                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                            >
                                <option value="">All</option>
                                <option value="true">Available</option>
                                <option value="false">Not Available</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        <ResultsCounter count={totalElements} />
                        <DoctorsGrid doctors={doctors} />
                        {totalPages > 1 && (
                            <PageNavigation
                                currentPage={currentPage}
                                totalPages={totalPages}
                                setCurrentPage={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DoctorsList;