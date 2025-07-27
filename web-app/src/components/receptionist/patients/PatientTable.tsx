'use client';
import React, { useState } from 'react';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { PatientDTOResponse } from '@/types/user';
import BookAppointmentModal from './BookAppointmentModal';

interface PatientTableProps {
    patients: PatientDTOResponse[];
}

export const PatientTable = ({ patients }: PatientTableProps) => {
    const calculateAge = (birthDate: string) => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getLastVisitDate = (appointments: PatientDTOResponse["recentAppointments"]) => {
        if (!appointments || appointments.length === 0) return null;
        const sorted = [...appointments].sort(
            (a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
        );
        return sorted[0].appointmentDate;
    };

    const [bookingPatient, setBookingPatient] = useState<PatientDTOResponse | null>(null);

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thông tin cá nhân
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Liên hệ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Địa chỉ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Lần khám cuối
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {patients.map((patient) => {
                            const lastVisit = getLastVisitDate(patient.recentAppointments);
                            return (
                                <tr key={patient.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{patient.firstName}</div>
                                            <div className="text-sm text-gray-500">
                                                {patient.gender} • {calculateAge(patient.dateOfBirth)} tuổi
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{patient.phone}</div>
                                        <div className="text-sm text-gray-500">{patient.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                        {/* Nếu DTO không có address, bạn có thể bỏ cột này hoặc hiển thị mặc định */}
                                        Không có thông tin
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {lastVisit ? formatDate(lastVisit) : 'Chưa khám'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-indigo-600 hover:text-indigo-900 p-1" title="Chỉnh sửa">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="text-green-600 hover:text-green-900 p-1"
                                                title="Đặt lịch khám"
                                                onClick={() => setBookingPatient(patient)}
                                            >
                                                <Calendar className="w-4 h-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 p-1" title="Xóa">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <BookAppointmentModal
                        open={!!bookingPatient}
                        patient={bookingPatient}
                        onClose={() => setBookingPatient(null)}
                        onSuccess={() => setBookingPatient(null)}
                    />
                </table>
            </div>
        </div>
    );
};
