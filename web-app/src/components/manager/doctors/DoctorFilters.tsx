'use client';

import { Search, Filter } from 'lucide-react';
import { Gender } from '@/types/doctor';

interface DoctorManagerFiltersProps {
    searchTerm: string;
    selectedDepartment: string;
    selectedGender?: Gender;
    isAvailable?: boolean;
    departments: string[];
    onSearchChange: (value: string) => void;
    onDepartmentChange: (value: string) => void;
    onGenderChange: (value?: Gender) => void;
    onAvailabilityChange: (value?: boolean) => void;
}

const DoctorFilters = ({
    searchTerm,
    selectedDepartment,
    selectedGender,
    isAvailable,
    departments,
    onSearchChange,
    onDepartmentChange,
    onGenderChange,
    onAvailabilityChange
}: DoctorManagerFiltersProps) => {
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
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={selectedDepartment}
                        onChange={(e) => onDepartmentChange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                        {departments.map((dept) => (
                            <option key={dept} value={dept === 'Tất cả' ? 'all' : dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Giới tính:</label>
                    <select
                        value={selectedGender || ''}
                        onChange={(e) => onGenderChange(e.target.value ? e.target.value as Gender : undefined)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                        <option value="">Tất cả</option>
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                        <option value="Other">Khác</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
                    <select
                        value={isAvailable === undefined ? '' : isAvailable.toString()}
                        onChange={(e) => onAvailabilityChange(e.target.value === '' ? undefined : e.target.value === 'true')}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                        <option value="">Tất cả</option>
                        <option value="true">Có sẵn</option>
                        <option value="false">Nghỉ</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default DoctorFilters;
