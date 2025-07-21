import { API_URL } from '@/utils/BaseUrl';
import { 
    Receptionist, 
    CreateReceptionistRequest, 
    UpdateReceptionistRequest,
    ReceptionistResponse,
    CreateReceptionistResponse 
} from '@/types/receptionist';

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

    // MAN009: Delete Receptionist Account
    deleteReceptionist: async (userId: number): Promise<CreateReceptionistResponse> => {
        try {
            const response = await fetch(`${API_URL}/api/manager/receptionists/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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