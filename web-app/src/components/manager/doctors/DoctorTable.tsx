'use client';

import { Edit, Trash2, Eye, Calendar, Phone, Mail, User } from 'lucide-react';
import { DoctorDetailResponse, Gender } from '@/types/doctor';

interface DoctorTableProps {
    doctors: DoctorDetailResponse[];
    onView: (doctor: DoctorDetailResponse) => void;
    onEdit: (doctor: DoctorDetailResponse) => void;
    onDelete: (id: number) => void;
    onSchedule: (doctor: DoctorDetailResponse) => void;
}

export const DoctorTable = ({ doctors, onView, onEdit, onDelete, onSchedule }: DoctorTableProps) => {
    const getStatusColor = (isAvailable: boolean) => {
        return isAvailable ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';
    };

    const getStatusText = (isAvailable: boolean) => {
        return isAvailable ? 'Có sẵn' : 'Tạm nghỉ';
    };

    const getDefaultAvatar = (name: string) => {
        const firstLetter = name?.charAt(0)?.toUpperCase() || 'D';
        return (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                {firstLetter}
            </div>
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (doctors.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bác sĩ</h3>
                <p className="text-gray-500">Không có bác sĩ nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">
                    Danh sách Bác sĩ ({doctors.length})
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Thông tin Bác sĩ
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Chuyên khoa & Kinh nghiệm
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Liên hệ
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Phí tư vấn
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {doctors.map((doctor) => (
                            <tr key={doctor.doctorId} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            {doctor.avatar ? (
                                                <img
                                                    className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                                                    src={doctor.avatar}
                                                    alt={doctor.fullName}
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        const parent = target.parentElement;
                                                        if (parent) {
                                                            parent.innerHTML = `<div class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">${doctor.fullName?.charAt(0)?.toUpperCase() || 'D'}</div>`;
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                getDefaultAvatar(doctor.fullName)
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-semibold text-gray-900 truncate">
                                                {doctor.fullName}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                ID: {doctor.doctorId} • {doctor.degree || 'Bác sĩ'}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                Giới tính: {doctor.gender === Gender.Male ? 'Nam' : doctor.gender === Gender.Female ? 'Nữ' : 'Khác'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium text-gray-900">
                                            {doctor.specialty.specialtyName || 'Chưa phân khoa'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            📅 {doctor.yearsOfExperience || 0} năm kinh nghiệm
                                        </div>
                                        {doctor.licenseNumber && (
                                            <div className="text-xs text-gray-500">
                                                📋 GP: {doctor.licenseNumber}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Mail className="w-3 h-3 mr-2 text-gray-400" />
                                            <span className="truncate max-w-[150px]" title={doctor.email}>
                                                {doctor.email}
                                            </span>
                                        </div>
                                        {doctor.phone && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Phone className="w-3 h-3 mr-2 text-gray-400" />
                                                {doctor.phone}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-semibold text-green-600">
                                        {formatCurrency(doctor.consultationFee || 0)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(doctor.isAvailable)}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${doctor.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {getStatusText(doctor.isAvailable)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => onView(doctor)}
                                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Xem chi tiết"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(doctor)}
                                            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onSchedule(doctor)}
                                            className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition-colors"
                                            title="Quản lý lịch"
                                        >
                                            <Calendar className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(doctor.doctorId)}
                                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                            title="Xóa"
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
