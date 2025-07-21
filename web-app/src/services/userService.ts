import { ApiResponse } from "@/types/apiResonse";
import { UserCreationRequest, UserCreationResponse } from "@/types/user";
import { API_URL } from "@/utils/BaseUrl";
import { fetchInterceptor } from "@/utils/Interceptor";

export const registration = async (data: UserCreationRequest): Promise<ApiResponse<UserCreationResponse>> => {
    const response = await fetchInterceptor(`${API_URL}/api/v1/users`, {
        method: "POST",
        body: JSON.stringify(data)
    })

    const result: ApiResponse<UserCreationResponse> = await response.json();
    return result;
} 