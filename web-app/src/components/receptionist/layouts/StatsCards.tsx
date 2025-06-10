'use client'

import { Calendar, CheckCircle, AlertCircle, Users } from 'lucide-react';

interface StatsCardsProps {
    stats: {
        total: number;
        confirmed: number;
        pending: number;
        totalPatients: number;
    };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
    const cards = [
        {
            title: 'Tổng lịch hẹn',
            value: stats.total,
            color: 'from-blue-500 to-blue-600',
            textColor: 'text-blue-100',
            icon: Calendar
        },
        {
            title: 'Đã xác nhận',
            value: stats.confirmed,
            color: 'from-green-500 to-green-600',
            textColor: 'text-green-100',
            icon: CheckCircle
        },
        {
            title: 'Chờ xử lý',
            value: stats.pending,
            color: 'from-yellow-500 to-yellow-600',
            textColor: 'text-yellow-100',
            icon: AlertCircle
        },
        {
            title: 'Tổng bệnh nhân',
            value: stats.totalPatients,
            color: 'from-purple-500 to-purple-600',
            textColor: 'text-purple-100',
            icon: Users
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {cards.map((card, index) => (
                <div key={index} className={`bg-gradient-to-r ${card.color} rounded-xl p-6 text-white shadow-lg`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-3xl font-bold">{card.value}</div>
                            <div className={`${card.textColor} font-medium`}>{card.title}</div>
                        </div>
                        <card.icon className="w-10 h-10 opacity-80" />
                    </div>
                </div>
            ))}
        </div>
    );
};