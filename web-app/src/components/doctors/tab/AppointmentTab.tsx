'use client'
import React, { useState } from 'react';
import { Check } from 'lucide-react';

export const AppointmentTab: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [appointmentType, setAppointmentType] = useState('in-person');

    const today = new Date();
    const nextDays = Array.from({ length: 14 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i + 1);
        return date;
    });

    const formatDate = (date: Date) => {
        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' })
        };
    };

    const availableTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Book an Appointment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Appointment Type */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Appointment Type</h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3">
                            <input
                                type="radio"
                                value="in-person"
                                checked={appointmentType === 'in-person'}
                                onChange={() => setAppointmentType('in-person')}
                                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-slate-700">In-Person</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input
                                type="radio"
                                value="telehealth"
                                checked={appointmentType === 'telehealth'}
                                onChange={() => setAppointmentType('telehealth')}
                                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-slate-700">Telehealth</span>
                        </label>
                    </div>
                </div>

                {/* Date Selection */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Select Date</h3>
                    <div className="grid grid-cols-7 gap-2">
                        {nextDays.map((date, index) => {
                            const { day, date: dayNum, month } = formatDate(date);
                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                                    className={`p-2 rounded-xl text-center text-sm font-medium transition-all ${selectedDate === date.toISOString().split('T')[0]
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                >
                                    <div>{dayNum}</div>
                                    <div className="text-xs">{month}</div>
                                    <div className="text-xs">{day}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Time Selection */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Select Time</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {availableTimes.map((time) => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`p-2 rounded-xl text-sm font-medium transition-all ${selectedTime === time
                                    ? 'bg-green-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center">
                    <button
                        disabled={!selectedDate || !selectedTime}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Confirm Appointment
                    </button>
                </div>
            </div>
            {selectedDate && selectedTime && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-green-800">
                    <div className="flex items-center gap-2">
                        <Check className="w-6 h-6" />
                        <span>Selected: {appointmentType === 'in-person' ? 'In-Person' : 'Telehealth'} on {new Date(selectedDate).toLocaleDateString()} at {selectedTime}</span>
                    </div>
                </div>
            )}
        </div>
    );
};