'use client'
import { Calendar } from 'lucide-react';

interface UpcomingAppointment {
    id: number;
    patientName: string;
    doctorName: string;
    department: string;
    time: string;
    date: string;
}

interface UpcomingAppointmentsProps {
    appointments: UpcomingAppointment[];
}

export const UpcomingAppointments = ({ appointments }: UpcomingAppointmentsProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch hẹn sắp tới</h2>
            <div className="space-y-4">
                {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                                <p className="text-xs text-gray-500">{appointment.doctorName} - {appointment.department}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                            <p className="text-xs text-gray-500">{appointment.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 