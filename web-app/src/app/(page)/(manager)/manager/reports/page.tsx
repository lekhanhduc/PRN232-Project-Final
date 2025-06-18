'use client'
import React from 'react';
import { ReportsManagement } from '@/components/manager/reports/ReportsManagement';
import { ManagerStats } from '@/types/manager';

export default function ReportsPage() {
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

    return <ReportsManagement stats={stats} />;
} 