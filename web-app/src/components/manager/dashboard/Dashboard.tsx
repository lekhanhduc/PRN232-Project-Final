'use client'
import { UserCheck, Users, Calendar, Building2, TrendingUp, Activity } from 'lucide-react';
import { RecentActivities } from './RecentActivities';
import { UpcomingAppointments } from './UpcomingAppointments';
import { QuickActions } from './QuickActions';
import { ManagerStats } from '@/types/manager';

interface DashboardProps {
    stats: ManagerStats;
}

export const Dashboard = ({ stats }: DashboardProps) => {
    const mockStats = {
        totalDoctors: 45,
        totalPatients: 1234,
        totalAppointments: 89,
        totalDepartments: 12,
        pendingAppointments: 23,
        completedAppointments: 156
    };

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

    const statCards = [
        {
            title: 'Tổng Bác sĩ',
            value: mockStats.totalDoctors,
            icon: UserCheck,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Tổng Bệnh nhân',
            value: mockStats.totalPatients,
            icon: Users,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            title: 'Lịch hẹn hôm nay',
            value: mockStats.totalAppointments,
            icon: Calendar,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Khoa/Phòng ban',
            value: mockStats.totalDepartments,
            icon: Building2,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        }
    ];

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Chào mừng trở lại!</h1>
                        <p className="text-blue-100">Tổng quan hệ thống quản lý bệnh viện</p>
                    </div>
                    <div className="hidden md:flex items-center space-x-2">
                        <Activity className="w-8 h-8 text-blue-200" />
                        <TrendingUp className="w-8 h-8 text-blue-200" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <RecentActivities activities={recentActivities} />
                </div>

                <div className="space-y-6">
                    <QuickActions actions={quickActions} />
                </div>
            </div>

            <div>
                <UpcomingAppointments appointments={upcomingAppointments} />
            </div>
        </div>
    );
}; 