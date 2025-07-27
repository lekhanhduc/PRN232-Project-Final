'use client'
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { AppointmentFilters } from './AppointmentFilters';
import { useAppointments } from '@/hooks/useAppointments';
import { AppointmentTable } from './AppointmentTable';
import { useAppointmentsForReceptionist } from '@/hooks/useAppointmentsForReceptionist';
import { receptionistService } from '@/services/receptionistService';

const CreateAppointmentModalForReceptionist = ({ open, onClose, onSuccess }: { open: boolean, onClose: () => void, onSuccess: () => void }) => {
    const [form, setForm] = useState({
        patientId: '',
        doctorId: '',
        slotId: '',
        appointmentDate: '',
        appointmentTime: '',
        reasonForVisit: '',
        packageId: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await receptionistService.createAppointmentForReceptionist({
                patientId: Number(form.patientId),
                doctorId: Number(form.doctorId),
                slotId: Number(form.slotId),
                appointmentDate: form.appointmentDate,
                appointmentTime: form.appointmentTime,
                reasonForVisit: form.reasonForVisit,
                packageId: Number(form.packageId),
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError('Có lỗi khi tạo lịch hẹn');
        } finally {
            setLoading(false);
        }
    };
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Tạo lịch hẹn mới</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input name="patientId" value={form.patientId} onChange={handleChange} placeholder="ID bệnh nhân" className="w-full border rounded p-2" required />
                    <input name="doctorId" value={form.doctorId} onChange={handleChange} placeholder="ID bác sĩ" className="w-full border rounded p-2" required />
                    <input name="slotId" value={form.slotId} onChange={handleChange} placeholder="ID ca khám" className="w-full border rounded p-2" required />
                    <input name="appointmentDate" value={form.appointmentDate} onChange={handleChange} placeholder="Ngày (yyyy-mm-dd)" className="w-full border rounded p-2" required />
                    <input name="appointmentTime" value={form.appointmentTime} onChange={handleChange} placeholder="Giờ (hh:mm)" className="w-full border rounded p-2" required />
                    <input name="packageId" value={form.packageId} onChange={handleChange} placeholder="ID gói dịch vụ" className="w-full border rounded p-2" required />
                    <textarea name="reasonForVisit" value={form.reasonForVisit} onChange={handleChange} placeholder="Lý do khám" className="w-full border rounded p-2" />
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <div className="flex gap-2 justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo lịch hẹn'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const AppointmentList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; 
});

    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showNewAppointment, setShowNewAppointment] = useState(false);

    const { appointments, updateAppointmentStatus } = useAppointmentsForReceptionist(selectedDate, searchTerm);
    const [refresh, setRefresh] = useState(false);
    const handleSuccess = () => setRefresh(r => !r);

    useEffect(() => {
        // Gọi lại khi refresh
        if (refresh) {
            // ... logic fetch lại appointments nếu cần ...
        }
    }, [refresh]);

    const filteredAppointments = appointments.filter(apt => {
        const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
        return matchesStatus;
    });

    return (
        <div>
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Quản lý Lịch hẹn</h2>
                    <button
                        onClick={() => setShowNewAppointment(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Thêm lịch hẹn</span>
                    </button>
                </div>

                <AppointmentFilters
                    searchTerm={searchTerm}
                    selectedDate={selectedDate}
                    statusFilter={statusFilter}
                    onSearchChange={setSearchTerm}
                    onDateChange={setSelectedDate}
                    onStatusChange={setStatusFilter}
                />
            </div>

            <AppointmentTable
                appointments={filteredAppointments}
                onUpdateStatus={updateAppointmentStatus}
            />
            <CreateAppointmentModalForReceptionist
                open={showNewAppointment}
                onClose={() => setShowNewAppointment(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
};
