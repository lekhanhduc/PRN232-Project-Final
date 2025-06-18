'use client'
import React from 'react';
import { AppointmentsManagement } from '@/components/manager/appointments/AppointmentsManagement';
import { Appointment } from '@/types/appointment';

export default function AppointmentsPage() {
    // Mock data - in real app, this would come from API
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
        },
        {
            id: '3',
            patientId: '3',
            patientName: 'Lê Thị H',
            phone: '0123456780',
            doctorName: 'Bác sĩ Nguyễn Văn I',
            department: 'Khoa Nhi',
            date: '2025-01-15',
            time: '14:00',
            status: 'completed',
            symptoms: 'Ho, sổ mũi'
        },
        {
            id: '4',
            patientId: '4',
            patientName: 'Phạm Văn K',
            phone: '0987654320',
            doctorName: 'Bác sĩ Trần Thị L',
            department: 'Khoa Tim mạch',
            date: '2025-01-16',
            time: '08:30',
            status: 'confirmed',
            symptoms: 'Đau ngực, khó thở'
        },
        {
            id: '5',
            patientId: '5',
            patientName: 'Hoàng Thị M',
            phone: '0123456781',
            doctorName: 'Bác sĩ Lê Văn N',
            department: 'Khoa Thần kinh',
            date: '2025-01-16',
            time: '11:00',
            status: 'cancelled',
            symptoms: 'Đau đầu, chóng mặt'
        }
    ];

    return <AppointmentsManagement appointments={mockAppointments} />;
} 