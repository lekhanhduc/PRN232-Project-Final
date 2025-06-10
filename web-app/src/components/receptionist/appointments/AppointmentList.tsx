'use client'
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AppointmentFilters } from './AppointmentFilters';
import { useAppointments } from '@/hooks/useAppointments';
import { AppointmentTable } from './AppointmentTable';

export const AppointmentList = () => {
    const { appointments, updateAppointmentStatus } = useAppointments();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('2025-06-10');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showNewAppointment, setShowNewAppointment] = useState(false);

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.phone.includes(searchTerm);
        const matchesDate = apt.date === selectedDate;
        const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
        return matchesSearch && matchesDate && matchesStatus;
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
        </div>
    );
};