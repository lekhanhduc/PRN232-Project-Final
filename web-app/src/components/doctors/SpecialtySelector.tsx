'use client'
import React from 'react';
import { Filter } from 'lucide-react';

interface SpecialtySelectorProps {
    selectedSpecialty: string;
    setSelectedSpecialty: (specialty: string) => void;
    specialties: string[];
}

const SpecialtySelector: React.FC<SpecialtySelectorProps> = ({ selectedSpecialty, setSelectedSpecialty, specialties }) => {
    return (
        <div className="w-full md:w-72">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                    className="block w-full pl-12 pr-10 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition duration-200 bg-white text-gray-700"
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                    {specialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                            {specialty}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default SpecialtySelector;