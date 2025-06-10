'use client'
import React from 'react';
import { User, Clock, Calendar } from 'lucide-react';

interface Doctor {
    id: string;
    name: string;
    department: string;
    schedule: {
        weekdays: string;
        saturday?: string;
        sunday?: string;
    };
    status: 'available' | 'busy' | 'off';
    avatar?: string;
}

interface DoctorCardProps {
    doctor: Doctor;
}

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-800',
                    dot: 'bg-green-400',
                    label: 'Có mặt'
                };
            case 'busy':
                return {
                    bg: 'bg-yellow-100',
                    text: 'text-yellow-800',
                    dot: 'bg-yellow-400',
                    label: 'Bận'
                };
            case 'off':
                return {
                    bg: 'bg-red-100',
                    text: 'text-red-800',
                    dot: 'bg-red-400',
                    label: 'Nghỉ phép'
                };
            default:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                    dot: 'bg-gray-400',
                    label: 'Không xác định'
                };
        }
    };

    const statusColors = getStatusColor(doctor.status);

    const getAvatarColor = (name: string) => {
        const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-purple-500',
            'bg-red-500',
            'bg-yellow-500',
            'bg-indigo-500'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Doctor Info Header */}
            <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 ${getAvatarColor(doctor.name)} rounded-full flex items-center justify-center`}>
                    {doctor.avatar ? (
                        <img
                            src={doctor.avatar}
                            alt={doctor.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <User className="w-6 h-6 text-white" />
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.department}</p>
                </div>
                <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${statusColors.dot}`}></div>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors.bg} ${statusColors.text}`}>
                        {statusColors.label}
                    </span>
                </div>
            </div>

            {/* Schedule Info */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Thứ 2 - Thứ 6:</span>
                    </div>
                    <span className="font-medium text-gray-900">{doctor.schedule.weekdays}</span>
                </div>

                {doctor.schedule.saturday && (
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Thứ 7:</span>
                        </div>
                        <span className="font-medium text-gray-900">{doctor.schedule.saturday}</span>
                    </div>
                )}

                {doctor.schedule.sunday && (
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Chủ nhật:</span>
                        </div>
                        <span className="font-medium text-gray-900">{doctor.schedule.sunday}</span>
                    </div>
                )}

                <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Trạng thái hôm nay:</span>
                        </div>
                        <span className={`font-medium ${statusColors.text}`}>
                            {statusColors.label}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-50 text-blue-600 text-sm px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                        Xem lịch hẹn
                    </button>
                    <button className="flex-1 bg-gray-50 text-gray-600 text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        Liên hệ
                    </button>
                </div>
            </div>
        </div>
    );
};