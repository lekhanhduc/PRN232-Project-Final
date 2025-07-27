'use client';
import React from 'react';
import { Edit, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AppointmentToday } from '@/types/appointment';

interface AppointmentTableProps {
    appointments: AppointmentToday[];
    onUpdateStatus: (id: number, status: AppointmentToday['status']) => void;
}

export const AppointmentTable = ({ appointments, onUpdateStatus }: AppointmentTableProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            case 'pending':
                return <AlertCircle className="w-4 h-4" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmed': return 'Đã xác nhận';
            case 'pending': return 'Chờ xử lý';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã lịch hẹn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bác sĩ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chuyên khoa</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phí khám</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {appointments.map((appointment) => (
                            <tr key={appointment.appointmentId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{appointment.appointmentId}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div>{appointment.patient.fullName}</div>
                                    <div className="text-xs text-gray-500">{appointment.patient.phone}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{appointment.doctor.fullName}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{appointment.doctor.specialty}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{appointment.appointmentTime}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {appointment.totalFee.toLocaleString('vi-VN')} VNĐ
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                        {getStatusIcon(appointment.status)}
                                        <span className="ml-1">{getStatusText(appointment.status)}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <div className="flex space-x-2">
                                        {appointment.status === 'pending' && (
                                            <button
                                                onClick={() => onUpdateStatus(appointment.appointmentId, 'confirmed')}
                                                className="text-green-600 hover:text-green-900 text-xs px-2 py-1 bg-green-50 rounded"
                                            >
                                                Xác nhận
                                            </button>
                                        )}
                                        {appointment.status === 'confirmed' && (
                                            <button
                                                onClick={() => onUpdateStatus(appointment.appointmentId, 'completed')}
                                                className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 bg-blue-50 rounded"
                                            >
                                                Hoàn thành
                                            </button>
                                        )}
                                        <button className="text-indigo-600 hover:text-indigo-900 p-1">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
