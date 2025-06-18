'use client'
import React from 'react';
import { DepartmentsManagement } from '@/components/manager/departments/DepartmentsManagement';
import { Department } from '@/types/manager';

export default function DepartmentsPage() {
    // Mock data - in real app, this would come from API
    const mockDepartments: Department[] = [
        {
            id: '1',
            name: 'Khoa Nội',
            description: 'Chuyên điều trị các bệnh nội khoa, bệnh lý tim mạch, hô hấp, tiêu hóa...',
            headDoctor: 'Bác sĩ Nguyễn Văn A',
            totalDoctors: 8,
            totalPatients: 450,
            status: 'active',
            createdAt: '2024-01-01',
            updatedAt: '2024-12-01'
        },
        {
            id: '2',
            name: 'Khoa Ngoại',
            description: 'Chuyên phẫu thuật và điều trị các bệnh ngoại khoa',
            headDoctor: 'Bác sĩ Trần Thị B',
            totalDoctors: 6,
            totalPatients: 320,
            status: 'active',
            createdAt: '2024-01-01',
            updatedAt: '2024-12-01'
        },
        {
            id: '3',
            name: 'Khoa Nhi',
            description: 'Chuyên điều trị bệnh nhi, chăm sóc sức khỏe trẻ em',
            headDoctor: 'Bác sĩ Lê Văn C',
            totalDoctors: 5,
            totalPatients: 280,
            status: 'active',
            createdAt: '2024-01-01',
            updatedAt: '2024-12-01'
        },
        {
            id: '4',
            name: 'Khoa Tim mạch',
            description: 'Chuyên điều trị các bệnh lý tim mạch',
            headDoctor: 'Bác sĩ Phạm Thị D',
            totalDoctors: 4,
            totalPatients: 200,
            status: 'active',
            createdAt: '2024-01-01',
            updatedAt: '2024-12-01'
        },
        {
            id: '5',
            name: 'Khoa Thần kinh',
            description: 'Chuyên điều trị các bệnh lý thần kinh',
            headDoctor: 'Bác sĩ Hoàng Văn E',
            totalDoctors: 3,
            totalPatients: 150,
            status: 'inactive',
            createdAt: '2024-01-01',
            updatedAt: '2024-12-01'
        }
    ];

    return <DepartmentsManagement departments={mockDepartments} />;
} 