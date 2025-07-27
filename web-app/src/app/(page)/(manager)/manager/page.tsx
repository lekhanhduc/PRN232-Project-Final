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

export type Doctor = {
    id: string;
    name: string;
    department: string;
    schedule: {
        weekdays: string;
        saturday?: string;
    };
    status: string;
    avatar: string;
};


export default function ManagerPage() {
    const [activeTab, setActiveTab] = useState('dashboard');

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

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard stats={stats} />;
            case 'doctors':
                return <DoctorsManagement specialties={[]} />;
            case 'departments':
                return <DepartmentsManagement />;
            case 'appointments':
                return <AppointmentsManagement appointments={[]} />;
            case 'patients':
                return <PatientsManagement patients={[]} />;
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