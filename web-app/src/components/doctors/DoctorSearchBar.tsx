'use client'
import React from 'react';
import { Search } from 'lucide-react';

interface DoctorSearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const DoctorSearchBar: React.FC<DoctorSearchBarProps> = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-700 placeholder-gray-400"
                placeholder="Tìm kiếm theo tên bác sĩ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

export default DoctorSearchBar;