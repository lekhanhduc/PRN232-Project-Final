'use client'
import React from 'react';

interface WorkingHour {
    day: string;
    hours: string;
    available: boolean;
}

interface WorkingHoursTabProps {
    workingHours: WorkingHour[];
}

export const WorkingHoursTab: React.FC<WorkingHoursTabProps> = ({ workingHours }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Working Hours</h2>
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                {workingHours.map((hour, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between py-3 ${index !== workingHours.length - 1 ? 'border-b border-slate-200' : ''}`}
                    >
                        <span className="text-slate-700 font-medium">{hour.day}</span>
                        <span className={`text-sm ${hour.available ? 'text-green-600' : 'text-red-600'}`}>
                            {hour.hours}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};