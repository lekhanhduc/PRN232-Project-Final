'use client'
import React from 'react';
import { UsersManagement } from '@/components/manager/users/UsersManagement';
import { SystemUser } from '@/types/manager';

export default function UsersPage() {
    // Mock data - in real app, this would come from API
    const mockUsers: SystemUser[] = [
        {
            id: '1',
            username: 'admin',
            email: 'admin@hospital.com',
            fullName: 'Quản trị viên Hệ thống',
            role: 'admin',
            status: 'active',
            lastLogin: '2025-01-15T08:30:00Z',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-12-01T00:00:00Z'
        },
        {
            id: '2',
            username: 'manager1',
            email: 'manager1@hospital.com',
            fullName: 'Nguyễn Văn Quản lý',
            role: 'manager',
            status: 'active',
            lastLogin: '2025-01-15T09:15:00Z',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-12-01T00:00:00Z'
        },
        {
            id: '3',
            username: 'doctor1',
            email: 'doctor1@hospital.com',
            fullName: 'Bác sĩ Nguyễn Văn A',
            role: 'doctor',
            department: 'Khoa Nội',
            status: 'active',
            lastLogin: '2025-01-15T07:45:00Z',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-12-01T00:00:00Z'
        },
        {
            id: '4',
            username: 'receptionist1',
            email: 'receptionist1@hospital.com',
            fullName: 'Lễ tân Trần Thị B',
            role: 'receptionist',
            status: 'active',
            lastLogin: '2025-01-15T08:00:00Z',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-12-01T00:00:00Z'
        },
        {
            id: '5',
            username: 'patient1',
            email: 'patient1@email.com',
            fullName: 'Bệnh nhân Lê Văn C',
            role: 'patient',
            status: 'active',
            lastLogin: '2025-01-14T15:30:00Z',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-12-01T00:00:00Z'
        },
        {
            id: '6',
            username: 'doctor2',
            email: 'doctor2@hospital.com',
            fullName: 'Bác sĩ Phạm Thị D',
            role: 'doctor',
            department: 'Khoa Ngoại',
            status: 'inactive',
            lastLogin: '2025-01-10T16:20:00Z',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-12-01T00:00:00Z'
        }
    ];

    return <UsersManagement users={mockUsers} />;
} 