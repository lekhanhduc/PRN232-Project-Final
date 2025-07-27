'use client';

import React, { useState } from 'react';
import { AppointmentResponse } from '@/types/appointment';
import { useAppointments } from '@/hooks/useAppointments';
import { useToast } from '@/hooks/useToast';
import { doctorService } from '@/services/doctorService';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

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
    const [newSlotId, setNewSlotId] = useState<number | null>(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [schedule, setSchedule] = useState<any[]>([]);
    const { rescheduleAppointment } = useAppointments();
    const { showSuccess, showError, showInfo } = useToast();
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    // Fetch available schedule for the doctor
    React.useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await doctorService.getDoctorAppointmentSchedule(appointment.doctor.doctorId);
                setSchedule(res.result?.workSchedules || []);
            } catch (err) {
                setSchedule([]);
            }
        };
        fetchSchedule();
    }, [appointment.doctor.doctorId]);

    // Lấy danh sách ngày có slot rảnh
    const availableDays = schedule.filter((day) => day.availableSlots.some((slot: any) => slot.isAvailable));
    // Lấy danh sách slot rảnh cho ngày đã chọn
    const availableSlots = schedule.find((d) => d.workDate.split('T')[0] === newDate)?.availableSlots.filter((slot: any) => slot.isAvailable) || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) {
            showInfo('Vui lòng đăng nhập để đổi lịch hẹn.');
            router.push('/login');
            return;
        }
        if (!newDate || !newSlotId || !reason.trim()) {
            showError('Vui lòng điền đầy đủ thông tin');
            return;
        }
        setLoading(true);
        try {
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
                        <select
                            id="newDate"
                            value={newDate}
                            onChange={(e) => {
                                setNewDate(e.target.value);
                                setNewSlotId(null);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                        >
                            <option value="">Chọn ngày</option>
                            {availableDays.map((day: any) => (
                                <option key={day.workDate} value={day.workDate.split('T')[0]}>
                                    {new Date(day.workDate).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="newSlotId" className="block text-sm font-medium text-gray-700 mb-2">
                            Giờ mới <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="newSlotId"
                            value={newSlotId || ''}
                            onChange={(e) => setNewSlotId(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading || !newDate}
                        >
                            <option value="">Chọn giờ</option>
                            {availableSlots.map((slot: any) => (
                                <option key={slot.slotId} value={slot.slotId}>
                                    {slot.slotTimeFormatted}
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