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
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Lịch hẹn sắp tới</h2>
                <div className="text-sm text-gray-500">
                    {appointments.length} lịch hẹn
                </div>
            </div>
            <div className="space-y-4">
                {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-blue-50 rounded-full">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{appointment.patientName}</p>
                                    <p className="text-xs text-gray-600">{appointment.doctorName}</p>
                                    <p className="text-xs text-gray-500">{appointment.department}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">{appointment.time}</p>
                                <p className="text-xs text-gray-500">{appointment.date}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Không có lịch hẹn nào</p>
                    </div>
                )}
            </div>
        </div>
    );
}; 