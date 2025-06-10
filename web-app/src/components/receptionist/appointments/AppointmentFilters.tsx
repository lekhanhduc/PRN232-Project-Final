'use client'
import { Search } from 'lucide-react';

interface AppointmentFiltersProps {
    searchTerm: string;
    selectedDate: string;
    statusFilter: string;
    onSearchChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}

export const AppointmentFilters = ({
    searchTerm,
    selectedDate,
    statusFilter,
    onSearchChange,
    onDateChange,
    onStatusChange
}: AppointmentFiltersProps) => {
    return (
        <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
            </select>
        </div>
    );
};