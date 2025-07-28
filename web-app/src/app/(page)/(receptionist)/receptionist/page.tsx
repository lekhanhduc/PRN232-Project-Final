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
import ChangeReceptionistPassword from '@/components/receptionist/patients/ChangePatientPassword';
import { Toaster } from 'react-hot-toast';

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
            <Toaster
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#FFFFFF',
                        color: '#1F2937',
                        fontSize: '14px',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        border: '1px solid #E5E7EB',
                    },
                }}
            />
            <Header />
            <div className="flex">
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} tabs={["appointments", "patients", "schedule", "change-password"]} />
                <div className="flex-1 p-6">
                    {activeTab !== 'change-password' && <StatsCards stats={todayStats} />}

                    {activeTab === 'appointments' && <AppointmentList />}
                    {activeTab === 'patients' && <PatientList />}
                    {activeTab === 'schedule' && <DoctorSchedule />}
                    {activeTab === 'change-password' && <ChangeReceptionistPassword />}
                </div>
            </div>
        </div>
    );
}