'use client'
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { doctorService } from '@/services/doctorService';
import { appointmentService } from '@/services/appointmentService';

// Types matching backend response
interface AppointmentTimeSlotResponse {
    slotId: number;
    slotTime: string;
    slotTimeFormatted: string;
    isAvailable: boolean;
    isBooked: boolean;
}

interface AppointmentDayResponse {
    scheduleId: number;
    workDate: string;
    startTime: string;
    endTime: string;
    maxPatients: number;
    isAvailable: boolean;
    availableSlots: AppointmentTimeSlotResponse[];
}

interface AppointmentTabProps {
    doctorId: number;
}

export const AppointmentTab: React.FC<AppointmentTabProps> = ({ doctorId }) => {
    const [schedule, setSchedule] = useState<AppointmentDayResponse[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedSlot, setSelectedSlot] = useState<AppointmentTimeSlotResponse | null>(null);
    const [reason, setReason] = useState('');
    const [packageId, setPackageId] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await doctorService.getDoctorAppointmentSchedule(doctorId);
                setSchedule(res.result?.workSchedules || []);
            } catch (err: any) {
                setError('Failed to load schedule');
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [doctorId]);

    const handleBook = async () => {
        if (!selectedDate || !selectedSlot) return;
        setBooking(true);
        setError(null);
        try {
            const payload = {
                doctorId,
                slotId: selectedSlot.slotId,
                appointmentDate: selectedDate,
                reasonForVisit: reason,
                packageId: packageId || 0,
            };
            const res = await appointmentService.createAppointment(payload);
            alert('Appointment booked successfully!\nAppointment Number: ' + res.result?.appointmentNumber);
            setSelectedDate('');
            setSelectedSlot(null);
            setReason('');
            setPackageId(undefined);
        } catch (err: any) {
            setError(err.message || 'Failed to book appointment');
        } finally {
            setBooking(false);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Book an Appointment</h2>
            {loading && <div>Loading schedule...</div>}
            {error && <div className="text-red-600">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Selection */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Select Date</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {schedule.map((day) => (
                            <button
                                key={day.workDate}
                                onClick={() => {
                                    setSelectedDate(day.workDate.split('T')[0]);
                                    setSelectedSlot(null);
                                }}
                                className={`p-2 rounded-xl text-center text-sm font-medium transition-all ${selectedDate === day.workDate.split('T')[0]
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                <div>{new Date(day.workDate).toLocaleDateString()}</div>
                            </button>
                        ))}
                    </div>
                </div>
                {/* Time Slot Selection */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Select Time Slot</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {schedule.find((d) => d.workDate.split('T')[0] === selectedDate)?.availableSlots.map((slot) => (
                            <button
                                key={slot.slotId}
                                onClick={() => setSelectedSlot(slot)}
                                disabled={!slot.isAvailable}
                                className={`p-2 rounded-xl text-sm font-medium transition-all ${selectedSlot?.slotId === slot.slotId
                                    ? 'bg-green-600 text-white'
                                    : slot.isAvailable
                                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                {slot.slotTimeFormatted}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Reason for Visit */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Reason for Visit</h3>
                    <textarea
                        className="w-full border rounded-xl p-2"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Describe your reason for visit..."
                    />
                </div>
                {/* Package Selection (optional) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Package (optional)</h3>
                    <input
                        type="number"
                        className="w-full border rounded-xl p-2"
                        value={packageId || ''}
                        onChange={(e) => setPackageId(Number(e.target.value))}
                        placeholder="Enter package ID if any"
                    />
                </div>
                {/* Submit Button */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center">
                    <button
                        disabled={!selectedDate || !selectedSlot || !reason || booking}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                        onClick={handleBook}
                    >
                        {booking ? 'Booking...' : 'Confirm Appointment'}
                    </button>
                </div>
            </div>
            {selectedDate && selectedSlot && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-green-800">
                    <div className="flex items-center gap-2">
                        <span>Selected: {new Date(selectedDate).toLocaleDateString()} at {selectedSlot.slotTimeFormatted}</span>
                    </div>
                </div>
            )}
        </div>
    );
};