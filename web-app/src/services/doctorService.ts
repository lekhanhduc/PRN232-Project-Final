import { ApiResponse } from '@/types/apiResonse';
import { DoctorSearchResponse, Gender } from '@/types/doctor';
import { PageResponse } from '@/types/pageResponse';
import { API_URL } from '@/utils/baseUrl';

export interface SearchDoctorsParams {
    doctorName?: string;
    specialtyName?: string;
    gender?: Gender;
    isAvailable?: boolean;
    orderBy?: string;
    page?: number;
    pageSize?: number;
}

export const doctorService = {
    async searchDoctors(params: SearchDoctorsParams = {}): Promise<ApiResponse<PageResponse<DoctorSearchResponse>>> {
        const queryParams = new URLSearchParams();
        
        if (params.doctorName) queryParams.append('doctorName', params.doctorName);
        if (params.specialtyName) queryParams.append('specialtyName', params.specialtyName);
        if (params.gender) queryParams.append('gender', params.gender);
        if (params.isAvailable !== undefined) queryParams.append('isAvailable', params.isAvailable.toString());
        if (params.orderBy) queryParams.append('orderBy', params.orderBy);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

        const response = await fetch(`${API_URL}/api/v1/doctors/search?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
}; 