import { useState, useEffect } from 'react';
import { appointmentService } from '@/services/appointmentService';
import { AppointmentResponse, CancelAppointmentRequest, RescheduleAppointmentRequest } from '@/types/appointment';
import { ApiResponse } from '@/types/apiResonse';

export const useAppointments = () => {
    const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Lấy danh sách cuộc hẹn
    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response: ApiResponse<AppointmentResponse[]> = await appointmentService.getMyAppointments();
            if (response.code === 200 && response.result) {
                setAppointments(response.result);
            } else {
                setError(response.message || 'Failed to fetch appointments');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Hủy cuộc hẹn
    const cancelAppointment = async (appointmentId: number, cancelReason: string) => {
        setLoading(true);
        setError(null);
        try {
            const request: CancelAppointmentRequest = { cancelReason };
            const response = await appointmentService.cancelAppointment(appointmentId, request);
            
            if (response.code === 200) {
                // Refresh danh sách sau khi hủy thành công
                await fetchAppointments();
                return { success: true, message: response.message };
            } else {
                setError(response.message || 'Failed to cancel appointment');
                return { success: false, message: response.message };
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Đổi lịch cuộc hẹn
    const rescheduleAppointment = async (
        appointmentId: number, 
        newSlotId: number, 
        newAppointmentDate: string, 
        reason: string
    ) => {
        setLoading(true);
        setError(null);
        try {
            const request: RescheduleAppointmentRequest = {
                newSlotId,
                newAppointmentDate,
                reason
            };
            const response = await appointmentService.rescheduleAppointment(appointmentId, request);
            
            if (response.code === 200) {
                // Refresh danh sách sau khi đổi lịch thành công
                await fetchAppointments();
                return { success: true, message: response.message };
            } else {
                setError(response.message || 'Failed to reschedule appointment');
                return { success: false, message: response.message };
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Lọc cuộc hẹn theo trạng thái
    const getAppointmentsByStatus = (status: string) => {
        return appointments.filter(appointment => appointment.status === status);
    };

    // Lấy cuộc hẹn sắp tới
    const getUpcomingAppointments = () => {
        const now = new Date();
        return appointments.filter(appointment => {
            const appointmentDateTime = new Date(`${appointment.appointmentDate} ${appointment.appointmentTime}`);
            return appointmentDateTime > now && appointment.status !== 'cancelled';
        });
    };

    // Lấy cuộc hẹn đã hoàn thành
    const getCompletedAppointments = () => {
        return appointments.filter(appointment => appointment.status === 'completed');
    };

    // Lấy cuộc hẹn đã hủy
    const getCancelledAppointments = () => {
        return appointments.filter(appointment => appointment.status === 'cancelled');
    };

    // Cập nhật trạng thái cuộc hẹn (cho receptionist)
    const updateAppointmentStatus = async (appointmentId: string, status: AppointmentResponse['status']) => {
        // TODO: Implement API call to update appointment status
        // For now, just update local state
        setAppointments(prev =>
            prev.map(apt =>
                apt.appointmentId.toString() === appointmentId
                    ? { ...apt, status }
                    : apt
            )
        );
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return {
        appointments,
        loading,
        error,
        fetchAppointments,
        cancelAppointment,
        rescheduleAppointment,
        getAppointmentsByStatus,
        getUpcomingAppointments,
        getCompletedAppointments,
        getCancelledAppointments,
        updateAppointmentStatus,
    };
};