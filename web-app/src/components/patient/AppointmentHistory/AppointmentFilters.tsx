'use client';

import React from 'react';

interface AppointmentFiltersProps {
    activeFilter: 'all' | 'upcoming' | 'completed' | 'cancelled';
    onFilterChange: (filter: 'all' | 'upcoming' | 'completed' | 'cancelled') => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    appointmentCount: number;
}

const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
    activeFilter,
    onFilterChange,
    searchTerm,
    onSearchChange,
    appointmentCount
}) => {
    const filters = [
        { key: 'all', label: 'Tất cả', icon: '📋' },
        { key: 'upcoming', label: 'Sắp tới', icon: '⏰' },
        { key: 'completed', label: 'Đã hoàn thành', icon: '✅' },
        { key: 'cancelled', label: 'Đã hủy', icon: '❌' }
    ] as const;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search */}
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo bác sĩ, mã cuộc hẹn..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2">
                    {filters.map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => onFilterChange(filter.key)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                                activeFilter === filter.key
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <span>{filter.icon}</span>
                            <span className="hidden sm:inline">{filter.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                    Hiển thị {appointmentCount} cuộc hẹn
                </p>
            </div>
        </div>
    );
};

export default AppointmentFilters; 