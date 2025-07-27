import {
    CreateReceptionistRequest,
    ReceptionistResponse,
    CreateReceptionistResponse
} from '@/types/receptionist';
import { AppointmentListDto, AppointmentCreationRequest, CreateAppointmentResponse } from "@/types/appointment";
import { PageResponse } from "@/types/pageResponse";
import { API_URL } from '@/utils/baseUrl';
import { ApiResponse } from '@/types/apiResonse';
import { PatientDTOResponse } from '@/types/user';

export const receptionistService = {
    getAllReceptionists: async (): Promise<ApiResponse<ReceptionistResponse>> => {
        const token = localStorage.getItem('accessToken');
        const url = `${API_URL}/api/Manager/receptionists`;

        console.log('🔍 Debug - Search Receptionists URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        });

        console.log('🔍 Debug - Response Status:', response.status);
        console.log('🔍 Debug - Response OK:', response.ok);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('🔍 Debug - Response Data:', data);
        return data;
    },


    getAllPatients: async (searchTerm?: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PageResponse<PatientDTOResponse>>> => {
        const token = localStorage.getItem('accessToken');
        const params = new URLSearchParams();
        if (searchTerm) params.append('query', searchTerm);
        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());
        const url = `${API_URL}/api/Receptionist/patients/search?${params.toString()}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    },

    getAppointmentsByDateAndQueryAsync: async (date?: string, query?: string): Promise<ApiResponse<AppointmentListDto[]>> => {
        const token = localStorage.getItem('accessToken');
        const params = new URLSearchParams();
        if (date) params.append('date', date);
        if (query) params.append('query', query);
        const url = `${API_URL}/api/Receptionist/appointments${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    },

    cancelAppointmentForReceptionist: async (appointmentId: number, patientId: number, cancelReason: string): Promise<ApiResponse<any>> => {
        const token = localStorage.getItem('accessToken');
        const url = `${API_URL}/api/Receptionist/appointments/${appointmentId}/cancel?patientId=${patientId}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ cancelReason }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    createAppointmentForReceptionist: async (data: AppointmentCreationRequest): Promise<ApiResponse<CreateAppointmentResponse>> => {
        const token = localStorage.getItem('accessToken');
        const url = `${API_URL}/api/Receptionist/appointments`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },


    // MAN007: Create Receptionist Account
    createReceptionist: async (receptionistData: CreateReceptionistRequest): Promise<ApiResponse<CreateReceptionistResponse>> => {
        try {
            const response = await fetch(`${API_URL}/api/Manager/receptionists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(receptionistData)
            });

            if (!response.ok) {
                throw new Error('Failed to create receptionist');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating receptionist:', error);
            throw error;
        }
    },


    // MAN008: Update Receptionist Information
    updateReceptionist: async (userId: number, updateData: CreateReceptionistRequest): Promise<ApiResponse<CreateReceptionistResponse>> => {
        try {
            const response = await fetch(`${API_URL}/api/Manager/receptionists/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error('Failed to update receptionist');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating receptionist:', error);
            throw error;
        }
    },


    deleteReceptionist: async (userId: number): Promise<ApiResponse<object>> => {
        try {
            const response = await fetch(`${API_URL}/api/Manager/receptionists/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete receptionist');
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting receptionist:', error);
            throw error;
        }
    },

    async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>> {
        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch(`${API_URL}/api/v1/patients/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    OldPassword: currentPassword,
                    NewPassword: newPassword
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }
};