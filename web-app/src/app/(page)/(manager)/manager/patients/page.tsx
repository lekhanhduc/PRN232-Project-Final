'use client'
import React from 'react';
import { PatientsManagement } from '@/components/manager/patients/PatientsManagement';
import { Patient } from '@/types/appointment';

export default function PatientsPage() {
    // Mock data - in real app, this would come from API
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
        },
        {
            id: '3',
            name: 'Lê Thị H',
            phone: '0123456780',
            email: 'lethi.h@email.com',
            address: '789 Đường DEF, Quận 3, TP.HCM',
            birthDate: '1995-03-10',
            gender: 'female',
            lastVisit: '2025-01-14'
        },
        {
            id: '4',
            name: 'Phạm Văn K',
            phone: '0987654320',
            email: 'phamvan.k@email.com',
            address: '321 Đường GHI, Quận 4, TP.HCM',
            birthDate: '1978-12-25',
            gender: 'male',
            lastVisit: '2025-01-13'
        },
        {
            id: '5',
            name: 'Hoàng Thị M',
            phone: '0123456781',
            email: 'hoangthi.m@email.com',
            address: '654 Đường JKL, Quận 5, TP.HCM',
            birthDate: '1982-07-08',
            gender: 'female',
            lastVisit: '2025-01-11'
        },
        {
            id: '6',
            name: 'Vũ Văn N',
            phone: '0987654322',
            email: 'vuvan.n@email.com',
            address: '987 Đường MNO, Quận 6, TP.HCM',
            birthDate: '1992-11-30',
            gender: 'male',
            lastVisit: '2025-01-09'
        }
    ];

    return <PatientsManagement patients={mockPatients} />;
} 