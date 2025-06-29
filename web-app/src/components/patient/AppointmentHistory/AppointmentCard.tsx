'use client';

import React, { useState } from 'react';
import { AppointmentResponse } from '@/types/appointment';
import { formatDateString } from '@/utils/dateUtils';
import { CancelAppointmentModal, RescheduleAppointmentModal } from './index';

interface AppointmentCardProps {
    appointment: AppointmentResponse;
    onRefresh: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onRefresh }) => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);

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
            case 'rescheduled':
                return 'bg-purple-100 text-purple-800';
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
                return 'Đã hoàn thành';
            case 'cancelled':
                return 'Đã hủy';
            case 'rescheduled':
                return 'Đã đổi lịch';
            default:
                return status;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                                #{appointment.appointmentNumber}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {getStatusText(appointment.status)}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">
                            {formatDateString(appointment.appointmentDate)} - {appointment.appointmentTime}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold text-blue-600">
                            {formatCurrency(appointment.totalFee)}
                        </p>
                    </div>
                </div>

                {/* Doctor Info */}
                <div className="border-t border-gray-100 pt-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{appointment.doctor.fullName}</h4>
                            <p className="text-sm text-gray-600">{appointment.doctor.specialty}</p>
                            <p className="text-xs text-gray-500">
                                {appointment.doctor.degree} • {appointment.doctor.yearsOfExperience} năm kinh nghiệm
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reason for Visit */}
                <div className="border-t border-gray-100 pt-4 mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Lý do khám</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                        {appointment.reasonForVisit}
                    </p>
                </div>

                {/* Actions */}
                {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                    <div className="border-t border-gray-100 pt-4">
                        <div className="flex gap-2">
                            {appointment.canCancel && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                                >
                                    Hủy lịch hẹn
                                </button>
                            )}
                            {appointment.canReschedule && (
                                <button
                                    onClick={() => setShowRescheduleModal(true)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                                >
                                    Đổi lịch hẹn
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showCancelModal && (
                <CancelAppointmentModal
                    appointment={appointment}
                    onClose={() => setShowCancelModal(false)}
                    onSuccess={() => {
                        setShowCancelModal(false);
                        onRefresh();
                    }}
                />
            )}

            {showRescheduleModal && (
                <RescheduleAppointmentModal
                    appointment={appointment}
                    onClose={() => setShowRescheduleModal(false)}
                    onSuccess={() => {
                        setShowRescheduleModal(false);
                        onRefresh();
                    }}
                />
            )}
        </>
    );
};

export default AppointmentCard; 