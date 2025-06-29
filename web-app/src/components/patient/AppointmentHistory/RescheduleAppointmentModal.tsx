'use client';

import React, { useState } from 'react';
import { AppointmentResponse } from '@/types/appointment';
import { useAppointments } from '@/hooks/useAppointments';
import { useToast } from '@/hooks/useToast';

interface RescheduleAppointmentModalProps {
    appointment: AppointmentResponse;
    onClose: () => void;
    onSuccess: () => void;
}

const RescheduleAppointmentModal: React.FC<RescheduleAppointmentModalProps> = ({
    appointment,
    onClose,
    onSuccess
}) => {
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const { rescheduleAppointment } = useAppointments();
    const { showSuccess, showError } = useToast();

    // Mock time slots - in real app, this would come from API
    const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newDate || !newTime || !reason.trim()) {
            showError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        // Validate that new date is in the future
        const selectedDateTime = new Date(`${newDate} ${newTime}`);
        const now = new Date();
        
        if (selectedDateTime <= now) {
            showError('Thời gian mới phải trong tương lai');
            return;
        }

        setLoading(true);

        try {
            // Mock slot ID - in real app, this would be determined by the selected date/time
            const newSlotId = Math.floor(Math.random() * 1000) + 1;
            
            const result = await rescheduleAppointment(
                appointment.appointmentId,
                newSlotId,
                newDate,
                reason
            );
            
            if (result.success) {
                showSuccess('Đổi lịch hẹn thành công');
                onSuccess();
            } else {
                showError(result.message || 'Có lỗi xảy ra khi đổi lịch hẹn');
            }
        } catch (err) {
            showError('Có lỗi xảy ra khi đổi lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    // Get minimum date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Đổi lịch hẹn</h3>
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
                        Thông tin lịch hẹn hiện tại:
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
                        <label htmlFor="newDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày mới <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="newDate"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            min={minDate}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="newTime" className="block text-sm font-medium text-gray-700 mb-2">
                            Giờ mới <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="newTime"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                        >
                            <option value="">Chọn giờ</option>
                            {timeSlots.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                            Lý do đổi lịch <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập lý do đổi lịch hẹn..."
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
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                'Xác nhận đổi lịch'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RescheduleAppointmentModal; 