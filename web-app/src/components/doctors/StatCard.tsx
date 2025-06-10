
'use client'
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    iconColor: string;
    bgColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, iconColor, bgColor }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-600 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                </div>
                <div className={`p-3 ${bgColor} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
};