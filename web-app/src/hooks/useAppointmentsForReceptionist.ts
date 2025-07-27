import { useEffect, useState } from 'react';
import { receptionistService } from '@/services/receptionistService';
import { AppointmentToday } from '@/types/appointment';

export const useAppointmentsForReceptionist = (date?: string, query?: string) => {
    const [appointments, setAppointments] = useState<AppointmentToday[]>([]);
    
    const fetchAppointments = async () => {
        try {
            const response = await receptionistService.getAllAppointmentToday(date, query);
            if (Array.isArray(response?.result)) {
                setAppointments(response.result);
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [date, query]); // 🔁 Tự động gọi lại khi date hoặc query thay đổi

    const updateAppointmentStatus = (id: number, status: string) => {
        setAppointments(prev =>
            prev.map(apt => apt.appointmentId === id ? { ...apt, status } : apt)
        );
    };

    return { appointments, updateAppointmentStatus };
};
