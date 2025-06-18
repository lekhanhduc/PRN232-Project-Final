'use client'
import { Search, Filter } from 'lucide-react';

interface DoctorFiltersProps {
    searchTerm: string;
    selectedDepartment: string;
    departments: string[];
    onSearchChange: (value: string) => void;
    onDepartmentChange: (value: string) => void;
}

export const DoctorFilters = ({
    searchTerm,
    selectedDepartment,
    departments,
    onSearchChange,
    onDepartmentChange
}: DoctorFiltersProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bác sĩ..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={selectedDepartment}
                        onChange={(e) => onDepartmentChange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {departments.map((dept) => (
                            <option key={dept} value={dept === 'Tất cả' ? 'all' : dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}; 