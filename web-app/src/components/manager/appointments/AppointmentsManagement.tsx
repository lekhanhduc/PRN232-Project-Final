'use client'
import { useState } from 'react';
import { Search, Calendar, Clock, User } from 'lucide-react';
import { Appointment } from '@/types/appointment';

interface AppointmentsManagementProps {
    appointments: Appointment[];
}

export const AppointmentsManagement = ({ appointments }: AppointmentsManagementProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const statusOptions = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'confirmed', label: 'Đã xác nhận' },
        { value: 'pending', label: 'Chờ xác nhận' },
        { value: 'completed', label: 'Hoàn thành' },
        { value: 'cancelled', label: 'Đã hủy' }
    ];

    const dateOptions = [
        { value: 'all', label: 'Tất cả ngày' },
        { value: 'today', label: 'Hôm nay' },
        { value: 'tomorrow', label: 'Ngày mai' },
        { value: 'week', label: 'Tuần này' }
    ];

    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch =
            appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.department.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;

        const matchesDate = (() => {
            if (dateFilter === 'all') return true;
            const appointmentDate = new Date(appointment.date);
            const today = new Date();

            switch (dateFilter) {
                case 'today':
                    return appointmentDate.toDateString() === today.toDateString();
                case 'tomorrow':
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return appointmentDate.toDateString() === tomorrow.toDateString();
                case 'week':
                    const weekStart = new Date(today);
                    weekStart.setDate(today.getDate() - today.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return appointmentDate >= weekStart && appointmentDate <= weekEnd;
                default:
                    return true;
            }
        })();

        return matchesSearch && matchesStatus && matchesDate;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'Đã xác nhận';
            case 'pending':
                return 'Chờ xác nhận';
            case 'completed':
                return 'Hoàn thành';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn</h2>
                <div className="text-sm text-gray-500">
                    Tổng cộng: {filteredAppointments.length} lịch hẹn
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm lịch hẹn..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {dateOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bệnh nhân
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bác sĩ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khoa
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày & Giờ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAppointments.map((appointment) => (
                                <tr key={appointment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-gray-500" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                                                <div className="text-sm text-gray-500">{appointment.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{appointment.doctorName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{appointment.department}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-900">{formatDate(appointment.date)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-500">{appointment.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                            {getStatusText(appointment.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                Xem
                                            </button>
                                            <button className="text-green-600 hover:text-green-900">
                                                Sửa
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                Hủy
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-full">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Đã xác nhận</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {appointments.filter(apt => apt.status === 'confirmed').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-full">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {appointments.filter(apt => apt.status === 'pending').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {appointments.filter(apt => apt.status === 'completed').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-full">
                            <Calendar className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Đã hủy</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {appointments.filter(apt => apt.status === 'cancelled').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 