'use client'
import React, { useState } from 'react';
import { AppointmentList } from '@/components/receptionist/appointments/AppointmentList';
import { PatientList } from '@/components/receptionist/patients/PatientList';
import { DoctorSchedule } from '@/components/receptionist/schedule/DoctorSchedule';
import { useAppointments } from '@/hooks/useAppointments';
import { usePatients } from '@/hooks/usePatients';
import { Header } from '@/components/receptionist/layouts/Header';
import { Sidebar } from '@/components/receptionist/layouts/Sidebar';
import { StatsCards } from '@/components/receptionist/layouts/StatsCards';
import ChangePatientPassword from '@/components/receptionist/patients/ChangePatientPassword';

export default function ReceptionistPage() {
    const [activeTab, setActiveTab] = useState('appointments');
    const { appointments } = useAppointments();
    const { patients } = usePatients();

    const todayStats = {
        total: appointments.filter(apt => apt.appointmentDate === '2025-06-10').length,
        confirmed: appointments.filter(apt => apt.appointmentDate === '2025-06-10' && apt.status === 'confirmed').length,
        pending: appointments.filter(apt => apt.appointmentDate === '2025-06-10' && apt.status === 'pending').length,
        totalPatients: patients.length
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} tabs={["appointments", "patients", "schedule", "change-password"]} />
                <div className="flex-1 p-6">
                    <StatsCards stats={todayStats} />

                    {activeTab === 'appointments' && <AppointmentList />}
                    {activeTab === 'patients' && <PatientList />}
                    {activeTab === 'schedule' && <DoctorSchedule />}
                    {activeTab === 'change-password' && <ChangePatientPassword />}
                </div>
            </div>
        </div>
    );
}