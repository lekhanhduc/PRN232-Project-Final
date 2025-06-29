import { ApiResponse } from "@/types/apiResonse";
import { PageResponse } from "@/types/pageResponse";
import { DoctorCreationRequest, DoctorDetailResponse, DoctorCreationResponse, DoctorUpdateRequest } from "@/types/doctor";
import { API_URL } from "@/utils/BaseUrl";
import { fetchInterceptor } from "@/utils/Interceptor";

export const getDoctors = async (): Promise<ApiResponse<PageResponse<DoctorDetailResponse>>> => {
    const response = await fetchInterceptor(`${API_URL}/api/v1/doctors`, {
        method: 'GET',
    });

    const data: ApiResponse<PageResponse<DoctorDetailResponse>> = await response.json();
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
