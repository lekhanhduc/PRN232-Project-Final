import {
    Receptionist,
    CreateReceptionistRequest,
    UpdateReceptionistRequest,
    ReceptionistResponse,
    CreateReceptionistResponse
} from '@/types/receptionist';
import { AppointmentToday} from "@/types/appointment";
import { PageResponse } from "@/types/pageResponse";
import { API_URL } from '@/utils/baseUrl';
import { ApiResponse } from '@/types/apiResonse';
import { PatientDTOResponse } from '@/types/user';

export const receptionistService = {
    // MAN010: Get All Receptionists
    getAllReceptionists: async (): Promise<Receptionist[]> => {
        try {
            const response = await fetch(`${API_URL}/api/manager/receptionists`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch receptionists');
            }

            const data: ReceptionistResponse = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching receptionists:', error);
            throw error;
        }
    },

   getAllPatients: async (searchTerm?: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PageResponse<PatientDTOResponse>>> => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('query', searchTerm);
        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());
        const url = `${API_URL}/api/Receptionist/patients/search?${params.toString()}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    },

    getAppointmentsByDateAndQueryAsync: async (date?: string, query?: string): Promise<ApiResponse<AppointmentToday[]>> => {
        const params = new URLSearchParams();
        if (date) params.append('date', date);
        if (query) params.append('query', query);
        const url = `${API_URL}/api/Receptionist/appointments${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    },

    cancelAppointmentForReceptionist: async (appointmentId: number, patientId: number, cancelReason: string): Promise<ApiResponse<any>> => {
        const url = `${API_URL}/api/Receptionist/appointments/${appointmentId}/cancel?patientId=${patientId}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cancelReason }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    createAppointmentForReceptionist: async (data: {
        patientId: number;
        doctorId: number;
        slotId: number;
        appointmentDate: string;
        appointmentTime: string;
        reasonForVisit?: string;
        packageId: number;
    }): Promise<ApiResponse<any>> => {
        const url = `${API_URL}/api/Receptionist/appointments`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },


    // MAN007: Create Receptionist Account
    createReceptionist: async (receptionistData: CreateReceptionistRequest): Promise<CreateReceptionistResponse> => {
        try {
            const response = await fetch(`${API_URL}/api/manager/receptionists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
    updateReceptionist: async (userId: number, updateData: UpdateReceptionistRequest): Promise<CreateReceptionistResponse> => {
        try {
            const response = await fetch(`${API_URL}/api/manager/receptionists/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
};
