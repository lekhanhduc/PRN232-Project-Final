'use client'
import { Users, UserCheck, Calendar, Building2, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardsProps {
    stats: {
        totalDoctors: number;
        totalPatients: number;
        totalAppointments: number;
        totalDepartments: number;
        appointmentsToday: number;
        newPatientsThisMonth: number;
    };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
    const cards = [
        {
            title: 'Tổng số Bác sĩ',
            value: stats.totalDoctors,
            icon: UserCheck,
            color: 'bg-slate-500',
            trend: '+5%',
            trendUp: true
        },
        {
            title: 'Tổng số Bệnh nhân',
            value: stats.totalPatients,
            icon: Users,
            color: 'bg-emerald-500',
            trend: '+12%',
            trendUp: true
        },
        {
            title: 'Lịch hẹn Hôm nay',
            value: stats.appointmentsToday,
            icon: Calendar,
            color: 'bg-indigo-500',
            trend: '-3%',
            trendUp: false
        },
        {
            title: 'Khoa/Phòng ban',
            value: stats.totalDepartments,
            icon: Building2,
            color: 'bg-amber-500',
            trend: '+2%',
            trendUp: true
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {cards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">{card.title}</p>
                            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                        </div>
                        <div className={`p-3 rounded-full ${card.color}`}>
                            <card.icon className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        {card.trendUp ? (
                            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-rose-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                            card.trendUp ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                            {card.trend}
                        </span>
                        <span className="text-sm text-slate-500 ml-1">so với tháng trước</span>
                    </div>
                </div>
            ))}
        </div>
    );
}; 