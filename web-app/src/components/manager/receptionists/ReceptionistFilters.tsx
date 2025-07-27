'use client'
import { Search, Filter } from 'lucide-react';

interface ReceptionistFiltersProps {
    searchTerm: string;
    selectedStatus: string;
    resultsCount?: number;
    totalCount?: number;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}

export const ReceptionistFilters = ({
    searchTerm,
    selectedStatus,
    resultsCount = 0,
    totalCount = 0,
    onSearchChange,
    onStatusChange
}: ReceptionistFiltersProps) => {
    const statusOptions = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'active', label: '🟢 Đang hoạt động' },
        { value: 'inactive', label: '🔴 Tạm nghỉ' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Bộ lọc tìm kiếm</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Hiển thị {resultsCount} / {totalCount} lễ tân
                    </p>
                </div>
                <button
                    onClick={() => {
                        onSearchChange('');
                        onStatusChange('all');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Xóa bộ lọc
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tìm kiếm lễ tân
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo email, số điện thoại, ID..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái hoạt động
                    </label>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => onStatusChange(e.target.value)}
                            className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 appearance-none"
                        >
                            {statusOptions.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
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
            </div>

            {/* Active Filters Display */}
            {(searchTerm || selectedStatus !== 'all') && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Bộ lọc đang áp dụng:</span>
                        <div className="flex gap-2">
                            {searchTerm && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Tìm kiếm: "{searchTerm}"
                                </span>
                            )}
                            {selectedStatus !== 'all' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {statusOptions.find(s => s.value === selectedStatus)?.label}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 