'use client';
import React, { useState } from 'react';
import { Edit, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AppointmentToday } from '@/types/appointment';
import { receptionistService } from '@/services/receptionistService';

interface AppointmentTableProps {
    appointments: AppointmentToday[];
    onUpdateStatus: (id: number, status: AppointmentToday['status']) => void;
}

interface CancelModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

const CancelModal = ({ open, onClose, onConfirm }: CancelModalProps) => {
    const [reason, setReason] = useState('');
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Hủy lịch hẹn</h3>
                <textarea
                    className="w-full border rounded p-2 mb-4"
                    placeholder="Nhập lý do hủy..."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                    <button onClick={() => { onConfirm(reason); setReason(''); }} className="px-4 py-2 bg-red-600 text-white rounded">Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

export const AppointmentTable = ({ appointments, onUpdateStatus }: AppointmentTableProps) => {
    const [cancelModal, setCancelModal] = useState<{ open: boolean, appointmentId: number | null }>({ open: false, appointmentId: null });
    const [cancelLoading, setCancelLoading] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);

    const handleCancel = async (appointmentId: number, patientId: number, reason: string) => {
        setCancelLoading(true);
        setCancelError(null);
        try {
            await receptionistService.cancelAppointmentForReceptionist(appointmentId, patientId, reason);
            onUpdateStatus(appointmentId, 'cancelled');
            setCancelModal({ open: false, appointmentId: null });
        } catch (err) {
            setCancelError('Có lỗi khi hủy lịch hẹn');
        } finally {
            setCancelLoading(false);
        }
    };

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
                                        <button className="text-red-600 hover:text-red-900 p-1" onClick={() => setCancelModal({ open: true, appointmentId: appointment.appointmentId })}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {cancelModal.open && (
                <CancelModal
                    open={cancelModal.open}
                    onClose={() => setCancelModal({ open: false, appointmentId: null })}
                    onConfirm={reason => {
                        const appointment = appointments.find(a => a.appointmentId === cancelModal.appointmentId);
                        if (appointment) {
                            // patientId giả định là 1, cần sửa lại nếu có patientId thật
                            handleCancel(appointment.appointmentId, 1, reason);
                        }
                    }}
                />
            )}
        </div>
    );
};
