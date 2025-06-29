import { ApiResponse } from "@/types/apiResonse";
import { PageResponse } from "@/types/pageResponse";
import { SpecialtyDetailResponse } from "@/types/specialty";
import { API_URL } from "@/utils/BaseUrl";
import { fetchInterceptor } from "@/utils/Interceptor";

export const getSpecialties = async (): Promise<ApiResponse<PageResponse<SpecialtyDetailResponse>>> => {
    const response = await fetchInterceptor(`${API_URL}/api/v1/specialty`, {
        method: 'GET',
    });

    const data: ApiResponse<PageResponse<SpecialtyDetailResponse>> = await response.json();
    return data;
};
