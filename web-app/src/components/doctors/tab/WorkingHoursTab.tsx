'use client'
import React, { useEffect, useState } from 'react';
import { doctorService } from '@/services/doctorService';

interface WorkingTimeSlotResponse {
    slotId: number;
    slotTime: string;
    slotTimeFormatted: string;
    isAvailable: boolean;
}

interface WorkingDayResponse {
    date: string;
    dayOfWeek: string;
    availableSlots: WorkingTimeSlotResponse[];
}

interface WorkingHoursTabProps {
    doctorId: number;
}

export const WorkingHoursTab: React.FC<WorkingHoursTabProps> = ({ doctorId }) => {
    const [days, setDays] = useState<WorkingDayResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await doctorService.getDoctorWorkingSchedule(doctorId);
                setDays(res.result?.availableDays || []);
            } catch (err: any) {
                setError('Failed to load working schedule');
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [doctorId]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Working Schedules</h2>
            {loading && <div>Loading working schedule...</div>}
            {error && <div className="text-red-600">{error}</div>}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                {days.length === 0 && !loading && <div>No working schedules available.</div>}
                {days.map((day, idx) => (
                    <div key={day.date} className="mb-6">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                            <span className="text-slate-700 font-medium">{new Date(day.date).toLocaleDateString()} ({day.dayOfWeek})</span>
                            <span className="text-sm text-green-600">{day.availableSlots.length} slots</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {day.availableSlots.map((slot) => (
                                <span
                                    key={slot.slotId}
                                    className={`px-3 py-1 rounded-xl text-sm font-medium border ${slot.isAvailable ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-400 border-slate-200 line-through'}`}
                                >
                                    {slot.slotTimeFormatted}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};