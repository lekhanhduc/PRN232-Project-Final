'use client';

import { Search, Filter } from 'lucide-react';
import { Gender } from '@/types/doctor';

interface DoctorManagerFiltersProps {
    searchTerm: string;
    selectedDepartment: string;
    selectedGender?: Gender;
    isAvailable?: boolean;
    departments: string[];
    resultsCount?: number;
    totalCount?: number;
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
    resultsCount = 0,
    totalCount = 0,
    onSearchChange,
    onDepartmentChange,
    onGenderChange,
    onAvailabilityChange
}: DoctorManagerFiltersProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Bộ lọc tìm kiếm</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Hiển thị {resultsCount} / {totalCount} bác sĩ
                    </p>
                </div>
                <button
                    onClick={() => {
                        onSearchChange('');
                        onDepartmentChange('all');
                        onGenderChange(undefined);
                        onAvailabilityChange(undefined);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Xóa bộ lọc
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tìm kiếm bác sĩ
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Nhập tên bác sĩ, email hoặc số điện thoại..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Department Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chuyên khoa
                    </label>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                            value={selectedDepartment}
                            onChange={(e) => onDepartmentChange(e.target.value)}
                            className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 appearance-none"
                        >
                            {departments.map((dept) => (
                                <option key={dept} value={dept === 'Tất cả' ? 'all' : dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái hoạt động
                    </label>
                    <select
                        value={isAvailable === undefined ? '' : isAvailable.toString()}
                        onChange={(e) => onAvailabilityChange(e.target.value === '' ? undefined : e.target.value === 'true')}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="true">🟢 Đang hoạt động</option>
                        <option value="false">🔴 Tạm nghỉ</option>
                    </select>
                </div>
            </div>

            {/* Secondary Filters */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Giới tính:</label>
                        <select
                            value={selectedGender || ''}
                            onChange={(e) => onGenderChange(e.target.value ? e.target.value as Gender : undefined)}
                            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                            <option value="">Tất cả</option>
                            <option value={Gender.Male}>👨 Nam</option>
                            <option value={Gender.Female}>👩 Nữ</option>
                            <option value={Gender.Other}>⚧ Khác</option>
                        </select>
                    </div>

                    {/* Active Filters Display */}
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-sm text-gray-500">Bộ lọc đang áp dụng:</span>
                        <div className="flex gap-2">
                            {searchTerm && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Tìm kiếm: "{searchTerm}"
                                </span>
                            )}
                            {selectedDepartment !== 'all' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {selectedDepartment}
                                </span>
                            )}
                            {selectedGender && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {selectedGender === Gender.Male ? 'Nam' : selectedGender === Gender.Female ? 'Nữ' : 'Khác'}
                                </span>
                            )}
                            {isAvailable !== undefined && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {isAvailable ? 'Đang hoạt động' : 'Tạm nghỉ'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorFilters;
