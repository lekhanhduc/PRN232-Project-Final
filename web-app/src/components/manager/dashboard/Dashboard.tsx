'use client'
import { UserCheck, Users, Calendar, Building2 } from 'lucide-react';
import { RecentActivities } from './RecentActivities';
import { UpcomingAppointments } from './UpcomingAppointments';
import { QuickActions } from './QuickActions';
import { ManagerStats } from '@/types/manager';

interface DashboardProps {
    stats: ManagerStats;
}

export const Dashboard = ({ stats }: DashboardProps) => {
    const recentActivities = [
        {
            id: 1,
            type: 'appointment' as const,
            message: 'Bác sĩ Nguyễn Văn A có lịch hẹn mới',
            time: '2 phút trước',
            status: 'pending' as const
        },
        {
            id: 2,
            type: 'doctor' as const,
            message: 'Bác sĩ Trần Thị B đã được thêm vào hệ thống',
            time: '15 phút trước',
            status: 'completed' as const
        },
        {
            id: 3,
            type: 'patient' as const,
            message: 'Bệnh nhân mới đăng ký: Lê Văn C',
            time: '1 giờ trước',
            status: 'completed' as const
        },
        {
            id: 4,
            type: 'department' as const,
            message: 'Cập nhật thông tin khoa Tim mạch',
            time: '2 giờ trước',
            status: 'completed' as const
        }
    ];

    const upcomingAppointments = [
        {
            id: 1,
            patientName: 'Nguyễn Thị D',
            doctorName: 'Bác sĩ Phạm Văn E',
            department: 'Khoa Nội',
            time: '09:00',
            date: 'Hôm nay'
        },
        {
            id: 2,
            patientName: 'Trần Văn F',
            doctorName: 'Bác sĩ Lê Thị G',
            department: 'Khoa Ngoại',
            time: '10:30',
            date: 'Hôm nay'
        },
        {
            id: 3,
            patientName: 'Phạm Thị H',
            doctorName: 'Bác sĩ Nguyễn Văn I',
            department: 'Khoa Nhi',
            time: '14:00',
            date: 'Hôm nay'
        }
    ];

    const quickActions = [
        {
            id: 'add-doctor',
            title: 'Thêm Bác sĩ',
            icon: UserCheck,
            color: 'bg-blue-600',
            onClick: () => console.log('Add doctor')
        },
        {
            id: 'manage-patients',
            title: 'Quản lý Bệnh nhân',
            icon: Users,
            color: 'bg-green-600',
            onClick: () => console.log('Manage patients')
        },
        {
            id: 'appointments',
            title: 'Lịch hẹn',
            icon: Calendar,
            color: 'bg-purple-600',
            onClick: () => console.log('Appointments')
        },
        {
            id: 'departments',
            title: 'Khoa/Phòng ban',
            icon: Building2,
            color: 'bg-orange-600',
            onClick: () => console.log('Departments')
        }
    ];

    return (
        <div className="space-y-6">
            <RecentActivities activities={recentActivities} />
            {/* <UpcomingAppointments appointments={upcomingAppointments} />
            <QuickActions actions={quickActions} /> */}
        </div>
    );
}; 