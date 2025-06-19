'use client'
import { Edit, Trash2, Eye } from 'lucide-react';
import { Doctor } from '@/types/doctor';

interface DoctorTableProps {
    doctors: Doctor[];
    onView: (doctor: Doctor) => void;
    onEdit: (doctor: Doctor) => void;
    onDelete: (doctor: Doctor) => void;
}

export const DoctorTable = ({ doctors, onView, onEdit, onDelete }: DoctorTableProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'busy':
                return 'bg-yellow-100 text-yellow-800';
            case 'off':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available':
                return 'Có sẵn';
            case 'busy':
                return 'Bận';
            case 'off':
                return 'Nghỉ';
            default:
                return 'Không xác định';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bác sĩ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Khoa
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Lịch làm việc
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
                        {doctors.map((doctor) => (
                            <tr key={doctor.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={doctor.avatar || '/default-avatar.png'}
                                                alt={doctor.name}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                                            <div className="text-sm text-gray-500">ID: {doctor.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{doctor.department}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{doctor.schedule.weekdays}</div>
                                    {doctor.schedule.saturday && (
                                        <div className="text-sm text-gray-500">T7: {doctor.schedule.saturday}</div>
                                    )}
                                    {doctor.schedule.sunday && (
                                        <div className="text-sm text-gray-500">CN: {doctor.schedule.sunday}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doctor.status)}`}>
                                        {getStatusText(doctor.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onView(doctor)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(doctor)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(doctor)}
                                            className="text-red-600 hover:text-red-900"
                                        >
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