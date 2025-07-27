import {
    Receptionist,
    CreateReceptionistRequest,
    UpdateReceptionistRequest,
    ReceptionistResponse,
    CreateReceptionistResponse
} from '@/types/receptionist';
import { PatientDTOResponse} from "@/types/user";
import { AppointmentToday} from "@/types/appointment";
import { PageResponse } from "@/types/pageResponse";
import { API_URL } from '@/utils/baseUrl';
import { ApiResponse } from '@/types/apiResonse';

export const receptionistService = {
    // MAN010: Get All Receptionists
    getAllReceptionists: async (): Promise<ApiResponse<ReceptionistResponse>> => {
        // const token = localStorage.getItem('accessToken');
        const url = `${API_URL}/api/Manager/receptionists`;

        console.log('🔍 Debug - Search Receptionists URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // ...(token && { Authorization: `Bearer ${token}` }),
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

   getAllPatients: async (params?: string): Promise<ApiResponse<PatientDTOResponse>> => {
        // const token = localStorage.getItem('accessToken');
        const url = `${API_URL}/api/api/Receptionist/appointments/today`;

        console.log('🔍 Debug - Search Receptionists URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // ...(token && { Authorization: `Bearer ${token}` }),
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

    getAllAppointmentToday: async (date?: string, query?: string): Promise<ApiResponse<AppointmentToday>> => {
        const params = new URLSearchParams();

        if (date) params.append("date", date);
        if (query) params.append("query", query);

        const url = `${API_URL}/api/Receptionist/appointments/today${params.toString() ? `?${params.toString()}` : ''}`;

        console.log('🔍 URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Authorization nếu cần
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('🔍 Response Data:', data);
        return data;
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

    // MAN009: Delete Receptionist Account
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
    }
}; 