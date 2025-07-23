
import { ApiResponse } from "@/types/apiResonse";
import { DoctorCreationRequest, DoctorCreationResponse, DoctorDetailResponse, DoctorSearchResponse, DoctorUpdateRequest, Gender } from "@/types/doctor";
import { PageResponse } from "@/types/pageResponse";
import { API_URL } from "@/utils/baseUrl";
import { fetchInterceptor } from "@/utils/interceptor";

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
        console.log('🔍 Debug - Response Data:', data);
        return data;
    },

    async getDoctorDetails(doctorId: number): Promise<ApiResponse<DoctorDetailResponse>> {
        const url = `${API_URL}/api/v1/doctors/${doctorId}`;

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

export const getDoctors = async (params: SearchDoctorsParams = {}): Promise<ApiResponse<PageResponse<DoctorDetailResponse>>> => {
    const queryParams = new URLSearchParams();

    if (params.doctorName) queryParams.append('doctorName', params.doctorName);
    if (params.specialtyName) queryParams.append('specialtyName', params.specialtyName);
    if (params.gender) queryParams.append('gender', params.gender);
    if (params.isAvailable !== undefined) queryParams.append('isAvailable', params.isAvailable.toString());
    if (params.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const url = `${API_URL}/api/v1/doctors?${queryParams.toString()}`;
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
};


export const createDoctor = async (data: DoctorCreationRequest): Promise<ApiResponse<DoctorCreationResponse>> => {
    const response = await fetchInterceptor(`${API_URL}/api/v1/doctors`, {
        method: "POST",
        body: JSON.stringify(data)
    })

    const result: ApiResponse<DoctorCreationResponse> = await response.json();
    return result;
}

export const updateDoctor = async (data: DoctorUpdateRequest): Promise<ApiResponse<DoctorDetailResponse>> => {
    const response = await fetchInterceptor(`${API_URL}/api/v1/doctors`, {
        method: "PUT",
        body: JSON.stringify(data)
    })

    const result: ApiResponse<DoctorDetailResponse> = await response.json();
    return result;
}
export const deleteDoctor = async (id: number): Promise<ApiResponse<object>> => {
    const response = await fetchInterceptor(`${API_URL}/api/v1/doctors/${id}`, {
        method: 'DELETE',
    });

    const result: ApiResponse<object> = await response.json();
    return result;
};

export const importDoctorSchedules = async (file: File): Promise<ApiResponse<object>> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/v1/doctors/import-excel`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<object> = await response.json();
    return result;
};
