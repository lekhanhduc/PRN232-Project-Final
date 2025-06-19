'use client'
import React, { useState } from 'react';
import { StatsCards } from '@/components/manager/layouts/StatsCards';
import { Dashboard } from '@/components/manager/dashboard/Dashboard';
import { DoctorsManagement } from '@/components/manager/doctors/DoctorsManagement';
import { DepartmentsManagement } from '@/components/manager/departments/DepartmentsManagement';
import { AppointmentsManagement } from '@/components/manager/appointments/AppointmentsManagement';
import { PatientsManagement } from '@/components/manager/patients/PatientsManagement';
import { ReportsManagement } from '@/components/manager/reports/ReportsManagement';
import { UsersManagement } from '@/components/manager/users/UsersManagement';
import { ManagerStats } from '@/types/manager';
import { Doctor } from '@/types/doctor';
import { Appointment } from '@/types/appointment';
import { Patient } from '@/types/appointment';

export default function ManagerPage() {
    const [activeTab, setActiveTab] = useState('dashboard');

    // Mock data - in real app, this would come from API
    const stats: ManagerStats = {
        totalDoctors: 25,
        totalPatients: 1250,
        totalAppointments: 450,
        totalDepartments: 8,
        appointmentsToday: 45,
        newPatientsThisMonth: 89,
        totalRevenue: 12500000,
        pendingAppointments: 12
    };

    const mockDoctors: Doctor[] = [
        {
            id: '1',
            name: 'Bác sĩ Nguyễn Văn A',
            department: 'Khoa Nội',
            schedule: {
                weekdays: '8:00 - 17:00',
                saturday: '8:00 - 12:00'
            },
            status: 'available',
            avatar: '/default-avatar.png'
        },
        {
            id: '2',
            name: 'Bác sĩ Trần Thị B',
            department: 'Khoa Ngoại',
            schedule: {
                weekdays: '8:00 - 17:00'
            },
            status: 'busy',
            avatar: '/default-avatar.png'
        }
    ];

    const mockAppointments: Appointment[] = [
        {
            id: '1',
            patientId: '1',
            patientName: 'Nguyễn Thị D',
            phone: '0123456789',
            doctorName: 'Bác sĩ Phạm Văn E',
            department: 'Khoa Nội',
            date: '2025-01-15',
            time: '09:00',
            status: 'confirmed',
            symptoms: 'Đau đầu, sốt'
        },
        {
            id: '2',
            patientId: '2',
            patientName: 'Trần Văn F',
            phone: '0987654321',
            doctorName: 'Bác sĩ Lê Thị G',
            department: 'Khoa Ngoại',
            date: '2025-01-15',
            time: '10:30',
            status: 'pending',
            symptoms: 'Đau bụng'
        }
    ];

    const mockPatients: Patient[] = [
        {
            id: '1',
            name: 'Nguyễn Thị D',
            phone: '0123456789',
            email: 'nguyenthi.d@email.com',
            address: '123 Đường ABC, Quận 1, TP.HCM',
            birthDate: '1990-05-15',
            gender: 'female',
            lastVisit: '2025-01-10'
        },
        {
            id: '2',
            name: 'Trần Văn F',
            phone: '0987654321',
            email: 'tranvan.f@email.com',
            address: '456 Đường XYZ, Quận 2, TP.HCM',
            birthDate: '1985-08-20',
            gender: 'male',
            lastVisit: '2025-01-12'
        }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard stats={stats} />;
            case 'doctors':
                return <DoctorsManagement doctors={mockDoctors} />;
            case 'departments':
                return <DepartmentsManagement departments={[]} />;
            case 'appointments':
                return <AppointmentsManagement appointments={mockAppointments} />;
            case 'patients':
                return <PatientsManagement patients={mockPatients} />;
            case 'reports':
                return <ReportsManagement stats={stats} />;
            case 'users':
                return <UsersManagement users={[]} />;
            case 'settings':
                return (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cài đặt hệ thống</h2>
                        <p className="text-gray-600">Trang cài đặt sẽ được phát triển sau.</p>
                    </div>
                );
            default:
                return <Dashboard stats={stats} />;
        }
    };

    return (
        <div>
            {activeTab === 'dashboard' && <StatsCards stats={stats} />}
            {renderContent()}
        </div>
    );
} 