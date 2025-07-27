'use client';

import React, { useState } from 'react';
import { AppointmentResponse } from '@/types/appointment';
import { useAppointments } from '@/hooks/useAppointments';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface CancelAppointmentModalProps {
    appointment: AppointmentResponse;
    onClose: () => void;
    onSuccess: () => void;
}

const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
    appointment,
    onClose,
    onSuccess
}) => {
    const [cancelReason, setCancelReason] = useState('');
    const [loading, setLoading] = useState(false);
    const { cancelAppointment } = useAppointments();
    const { showSuccess, showError, showInfo } = useToast();
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) {
            showInfo('Vui lòng đăng nhập để hủy lịch hẹn.');
            router.push('/login');
            return;
        }
        if (!cancelReason.trim()) {
            showError('Vui lòng nhập lý do hủy lịch hẹn');
            return;
        }

        setLoading(true);

        try {
            const result = await cancelAppointment(appointment.appointmentId, cancelReason);
            
            if (result.success) {
                showSuccess('Hủy lịch hẹn thành công');
                onSuccess();
            } else {
                showError(result.message || 'Có lỗi xảy ra khi hủy lịch hẹn');
            }
        } catch (err) {
            showError('Có lỗi xảy ra khi hủy lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Hủy lịch hẹn</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={loading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-gray-600 mb-2">
                        Bạn có chắc chắn muốn hủy lịch hẹn này?
                    </p>
                    <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-900">
                            #{appointment.appointmentNumber} - {appointment.doctor.fullName}
                        </p>
                        <p className="text-sm text-gray-600">
                            {appointment.appointmentDate} - {appointment.appointmentTime}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 mb-2">
                            Lý do hủy <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="cancelReason"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="Nhập lý do hủy lịch hẹn..."
                            disabled={loading}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Đang xử lý...
                                </div>
                            ) : (
                                'Xác nhận hủy'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CancelAppointmentModal; 