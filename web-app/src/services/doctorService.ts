import { ApiResponse } from '@/types/apiResonse';
import { DoctorSearchResponse, DoctorDetailResponse, Gender } from '@/types/doctor';
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

        const url = `${API_URL}/api/v1/doctors/search?${queryParams.toString()}`;
        console.log('🔍 Debug - Search Doctors URL:', url);
        console.log('🔍 Debug - Search Parameters:', params);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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

    async getDoctorDetails(doctorId: number): Promise<ApiResponse<DoctorDetailResponse>> {
        const url = `${API_URL}/api/v1/doctors/${doctorId}`;
        console.log('🔍 Debug - Get Doctor Details URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('🔍 Debug - Doctor Details Response Status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('🔍 Debug - Doctor Details Response Data:', data);
        return data;
    },

    async getDoctorAppointmentSchedule(doctorId: number, fromDate?: string, toDate?: string) {
        const params = new URLSearchParams();
        if (fromDate) params.append('fromDate', fromDate);
        if (toDate) params.append('toDate', toDate);
        const url = `${API_URL}/api/v1/doctors/${doctorId}/schedule?${params.toString()}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    async getDoctorWorkingSchedule(doctorId: number, daysAhead: number = 14) {
        const params = new URLSearchParams();
        params.append('daysAhead', daysAhead.toString());
        const url = `${API_URL}/api/v1/doctors/${doctorId}/working-schedule?${params.toString()}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
}; 