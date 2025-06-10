import React from 'react';
import { Award, Users, TrendingUp, Star } from 'lucide-react';
import { DoctorData } from '@/types/doctor';
import { StatCard } from './StatCard';

interface DoctorQuickStatsProps {
    doctor: DoctorData;
}

export const DoctorQuickStats: React.FC<DoctorQuickStatsProps> = ({ doctor }) => {
    const stats = [
        {
            title: 'Experience',
            value: doctor.experience,
            icon: Award,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: 'Patients Treated',
            value: `${doctor.totalPatients.toLocaleString()}+`,
            icon: Users,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Success Rate',
            value: `${doctor.successRate}%`,
            icon: TrendingUp,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            title: 'Rating',
            value: `${doctor.rating}/5`,
            icon: Star,
            iconColor: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    iconColor={stat.iconColor}
                    bgColor={stat.bgColor}
                />
            ))}
        </div>
    );
};