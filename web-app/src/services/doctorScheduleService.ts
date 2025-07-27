import { ApiResponse } from '@/types/apiResonse';
import {
  WorkScheduleResponse,
  DoctorAppointmentResponse,
  LeaveRequestPayload,
  LeaveResponse,
  CompleteAppointmentRequest,
} from '@/types/doctorSchedule';
import { PageResponse } from '@/types/pageResponse';
import { API_URL } from '@/utils/BaseUrl';

export interface DoctorAppointmentFilterRequest {
  appointmentDate?: string;
  status?: string;
  orderBy?: string;
  page?: number;
  pageSize?: number;
}

export interface DoctorScheduleFilterRequest {
  fromDate?: string;
  toDate?: string;
  includeTimeSlots?: boolean;
}

export const doctorScheduleService = {
  /**
   * 📅 Fetch doctor's work schedule
   */
  async getMyWorkSchedule({
    fromDate,
    toDate,
    includeTimeSlots = true,
  }: DoctorScheduleFilterRequest = {}): Promise<ApiResponse<WorkScheduleResponse[]>> {
    const accessToken = localStorage.getItem('accessToken');
    try {
      let url = `${API_URL}/api/v1/doctor-schedules/schedule`;
      const params = new URLSearchParams();
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);
      if (includeTimeSlots) params.append('includeTimeSlots', String(includeTimeSlots));

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log('📅 Get Work Schedule URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: ApiResponse<WorkScheduleResponse[]> = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error getting doctor schedule:', error);
      throw error;
    }
  },

  /**
   * 📋 Fetch doctor's appointments with pagination and filters
   */
  async getMyAppointments(
    filterRequest: DoctorAppointmentFilterRequest = {}
  ): Promise<ApiResponse<PageResponse<DoctorAppointmentResponse>>> {
    const accessToken = localStorage.getItem('accessToken');
    try {
      let url = `${API_URL}/api/v1/doctor-schedules/appointments`;
      const params = new URLSearchParams();
      if (filterRequest.appointmentDate) params.append('appointmentDate', filterRequest.appointmentDate);
      if (filterRequest.status) params.append('status', filterRequest.status);
      if (filterRequest.orderBy) params.append('orderBy', filterRequest.orderBy);
      if (filterRequest.page) params.append('page', filterRequest.page.toString());
      if (filterRequest.pageSize) params.append('pageSize', filterRequest.pageSize.toString());

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log('📋 Get Appointments URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: ApiResponse<PageResponse<DoctorAppointmentResponse>> = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error getting doctor appointments:', error);
      throw error;
    }
  },

  /**
   * ✅ Mark patient as arrived
   */
  async markPatientArrived(appointmentId: number): Promise<ApiResponse<string>> {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const url = `${API_URL}/api/v1/doctor-schedules/appointments/${appointmentId}/arrived`;
      console.log('✅ Mark Patient Arrived URL:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: ApiResponse<string> = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error marking patient arrived:', error);
      throw error;
    }
  },

  /**
   * 🏁 Complete an appointment
   */
  async completeAppointment(
    appointmentId: number,
    request: CompleteAppointmentRequest
  ): Promise<ApiResponse<string>> {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const url = `${API_URL}/api/v1/doctor-schedules/appointments/${appointmentId}/complete`;
      console.log('🏁 Complete Appointment URL:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: ApiResponse<string> = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error completing appointment:', error);
      throw error;
    }
  },

  /**
   * 🏖️ Request a leave
   */
  async requestLeave(data: LeaveRequestPayload): Promise<ApiResponse<LeaveResponse>> {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const url = `${API_URL}/api/v1/doctor-schedules/leaves`;
      console.log('🏖️ Request Leave URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result: ApiResponse<LeaveResponse> = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error requesting leave:', error);
      throw error;
    }
  },

  /**
   * 📜 Fetch leave requests
   */
  async getMyLeaves(): Promise<ApiResponse<LeaveResponse[]>> {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const url = `${API_URL}/api/v1/doctor-schedules/leaves`;
      console.log('📜 Get My Leaves URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result: ApiResponse<LeaveResponse[]> = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error getting my leaves:', error);
      throw error;
    }
  },
};