'use client'
import React from 'react';
import { DoctorsManagement } from '@/components/manager/doctors/DoctorsManagement';
import { Doctor } from '@/types/doctor';

export default function DoctorsPage() {
    // Mock data - in real app, this would come from API
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
        },
        {
            id: '3',
            name: 'Bác sĩ Lê Văn C',
            department: 'Khoa Nhi',
            schedule: {
                weekdays: '8:00 - 16:00',
                saturday: '8:00 - 12:00',
                sunday: '8:00 - 12:00'
            },
            status: 'available',
            avatar: '/default-avatar.png'
        },
        {
            id: '4',
            name: 'Bác sĩ Phạm Thị D',
            department: 'Khoa Tim mạch',
            schedule: {
                weekdays: '9:00 - 18:00'
            },
            status: 'off',
            avatar: '/default-avatar.png'
        }
    ];

    return <DoctorsManagement doctors={mockDoctors} />;
} 