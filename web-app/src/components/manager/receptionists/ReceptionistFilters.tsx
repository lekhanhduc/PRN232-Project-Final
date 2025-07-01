'use client'
import { Search, Filter } from 'lucide-react';

interface ReceptionistFiltersProps {
    searchTerm: string;
    selectedStatus: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}

export const ReceptionistFilters = ({
    searchTerm,
    selectedStatus,
    onSearchChange,
    onStatusChange
}: ReceptionistFiltersProps) => {
    const statusOptions = ['Tất cả', 'Hoạt động', 'Không hoạt động'];

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                    <Filter className="text-gray-400 w-4 h-4" />
                    <select
                        value={selectedStatus}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}; 