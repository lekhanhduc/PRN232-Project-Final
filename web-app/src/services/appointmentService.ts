import { API_URL } from '@/utils/baseUrl';
import { ApiResponse } from '@/types/apiResonse';
import { 
    AppointmentResponse, 
    CancelAppointmentRequest, 
    RescheduleAppointmentRequest, 
    RescheduleAppointmentResponse 
} from '@/types/appointment';

class AppointmentService {
    private baseUrl = `${API_URL}/api/v1/appointments`;

    // Lấy danh sách cuộc hẹn của bệnh nhân
    async getMyAppointments(): Promise<ApiResponse<AppointmentResponse[]>> {
        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch(this.baseUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse<AppointmentResponse[]> = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    }

    // Hủy cuộc hẹn
    async cancelAppointment(appointmentId: number, request: CancelAppointmentRequest): Promise<ApiResponse<object>> {
        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch(`${this.baseUrl}/${appointmentId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse<object> = await response.json();
            return data;
        } catch (error) {
            console.error('Error canceling appointment:', error);
            throw error;
        }
    }

    // Đổi lịch cuộc hẹn
    async rescheduleAppointment(
        appointmentId: number, 
        request: RescheduleAppointmentRequest
    ): Promise<ApiResponse<RescheduleAppointmentResponse>> {
        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch(`${this.baseUrl}/${appointmentId}/reschedule`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse<RescheduleAppointmentResponse> = await response.json();
            return data;
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            throw error;
        }
    }
}

export const appointmentService = new AppointmentService(); 