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

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

const handleApiError = async (error: any) => {
    console.error('API Error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối và thử lại sau.');
    }
    if (error.status === 404) {
        throw new Error('Không tìm thấy thông tin yêu cầu');
    }
    if (error.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    if (error.status === 403) {
        throw new Error('Bạn không có quyền thực hiện thao tác này.');
    }
    throw error;
};

export const doctorService = {
    async searchDoctors(params: SearchDoctorsParams = {}): Promise<ApiResponse<PageResponse<DoctorSearchResponse>>> {
        try {
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

            const response = await fetch(url, {
                method: 'GET',
                headers: defaultHeaders,
                mode: 'cors'
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Search Doctors Error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('🔍 Debug - Response Data:', data);
            return data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    async getDoctorDetails(doctorId: number): Promise<ApiResponse<DoctorDetailResponse>> {
        try {
            const url = `${API_URL}/api/v1/doctors/${doctorId}`;
            console.log('🔍 Debug - Fetching doctor details from:', url);

            const accessToken = localStorage.getItem('accessToken');
            const headers = {
                ...defaultHeaders,
                ...(accessToken && { Authorization: `Bearer ${accessToken}` })
            };
            
            const response = await fetch(url, {
                method: 'GET',
                headers,
                mode: 'cors'
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Doctor Details Error:', errorText);
                throw { 
                    status: response.status, 
                    message: response.status === 404 ? 'Không tìm thấy thông tin bác sĩ' : errorText 
                };
            }

            const result: ApiResponse<DoctorDetailResponse> = await response.json();
            return result;
        } catch (error) {
            throw await handleApiError(error);
        }
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
    },

    async getAllDoctors(page: number = 1, pageSize: number = 8): Promise<ApiResponse<PageResponse<DoctorDetailResponse>>> {
        const params: SearchDoctorsParams = {
            page,
            pageSize
        };
        return getDoctors(params);
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

    const accessToken = localStorage.getItem("accessToken"); 
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
             ...(accessToken && { Authorization: `Bearer ${accessToken}` })
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
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
