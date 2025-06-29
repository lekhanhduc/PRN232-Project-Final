'use client';

import React, { useState } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { useToast } from '@/hooks/useToast';
import { AppointmentResponse } from '@/types/appointment';
import AppointmentCard from './AppointmentCard';
import AppointmentFilters from './AppointmentFilters';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Toast from '@/components/ui/Toast';
import { formatDateString } from '@/utils/dateUtils';

interface AppointmentHistoryProps {
    className?: string;
}

const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({ className = '' }) => {
    const {
        appointments,
        loading,
        error,
        fetchAppointments,
        getUpcomingAppointments,
        getCompletedAppointments,
        getCancelledAppointments,
    } = useAppointments();

    const { toast, hideToast, showSuccess, showError } = useToast();

    const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const getFilteredAppointments = (): AppointmentResponse[] => {
        let filtered = appointments;

        // Filter by status
        switch (activeFilter) {
            case 'upcoming':
                filtered = getUpcomingAppointments();
                break;
            case 'completed':
                filtered = getCompletedAppointments();
                break;
            case 'cancelled':
                filtered = getCancelledAppointments();
                break;
            default:
                filtered = appointments;
        }

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(appointment =>
                appointment.doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.appointmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.reasonForVisit.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const handleRefresh = async () => {
        try {
            await fetchAppointments();
            showSuccess('Đã làm mới danh sách cuộc hẹn');
        } catch (err) {
            showError('Có lỗi xảy ra khi làm mới danh sách');
        }
    };

    const filteredAppointments = getFilteredAppointments();

    if (loading && appointments.length === 0) {
        return (
            <div className={`flex justify-center items-center min-h-[400px] ${className}`}>
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error && appointments.length === 0) {
        return (
            <div className={`text-center py-8 ${className}`}>
                <div className="text-red-500 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-lg font-semibold">Có lỗi xảy ra</p>
                    <p className="text-gray-600">{error}</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <>
            <div className={`space-y-6 ${className}`}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Lịch sử cuộc hẹn</h1>
                        <p className="text-gray-600 mt-1">
                            Quản lý và theo dõi các cuộc hẹn của bạn
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Làm mới
                    </button>
                </div>

                {/* Filters */}
                <AppointmentFilters
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    appointmentCount={filteredAppointments.length}
                />

                {/* Appointments List */}
                <div className="space-y-4">
                    {loading && appointments.length > 0 && (
                        <div className="flex justify-center py-4">
                            <LoadingSpinner size="md" />
                        </div>
                    )}

                    {filteredAppointments.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {activeFilter === 'all' ? 'Chưa có cuộc hẹn nào' :
                                 activeFilter === 'upcoming' ? 'Không có cuộc hẹn sắp tới' :
                                 activeFilter === 'completed' ? 'Chưa có cuộc hẹn hoàn thành' :
                                 'Chưa có cuộc hẹn bị hủy'}
                            </h3>
                            <p className="text-gray-600">
                                {activeFilter === 'all' ? 'Bạn chưa có cuộc hẹn nào. Hãy đặt lịch hẹn với bác sĩ ngay!' :
                                 activeFilter === 'upcoming' ? 'Hiện tại không có cuộc hẹn sắp tới.' :
                                 activeFilter === 'completed' ? 'Bạn chưa có cuộc hẹn nào đã hoàn thành.' :
                                 'Bạn chưa có cuộc hẹn nào bị hủy.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredAppointments.map((appointment) => (
                                <AppointmentCard
                                    key={appointment.appointmentId}
                                    appointment={appointment}
                                    onRefresh={handleRefresh}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
            />
        </>
    );
};

export default AppointmentHistory; 