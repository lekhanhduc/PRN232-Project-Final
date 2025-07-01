import { API_URL } from '@/utils/baseUrl';
import { ApiResponse } from '@/types/apiResonse';
import { PatientDetailResponse, PatientDetailRequest } from '@/types/user';

class PatientService {
    private baseUrl = `${API_URL}/api/v1/patients`;

    async getPatientProfile(): Promise<ApiResponse<PatientDetailResponse>> {
        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch(this.baseUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse<PatientDetailResponse> = await response.json();
            console.log(data)
            return data;
        } catch (error) {
            console.error('Error fetching patient profile:', error);
            throw error;
        }
    }

    // Cập nhật thông tin bệnh nhân
    async updatePatientProfile(request: PatientDetailRequest): Promise<ApiResponse<PatientDetailResponse>> {
        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch(this.baseUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse<PatientDetailResponse> = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating patient profile:', error);
            throw error;
        }
    }

    // Kích hoạt xác thực 2 bước
    async enable2FA(phoneOrEmail: string): Promise<ApiResponse<string>> {
        try {
            console.log('Making 2FA request to:', `${API_URL}/api/v1/2fa`);
            console.log('Request body:', { phoneOrEmail });

            const response = await fetch(`${API_URL}/api/v1/2fa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneOrEmail: phoneOrEmail
                }),
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log('Response data:', data);
            return data;
        } catch (error) {
            console.error('Error enabling 2FA:', error);
            throw error;
        }
    }

    // Xác thực mã 2FA
    async verify2FA(phoneOrEmail: string, code: string): Promise<ApiResponse<any>> {
        console.log(phoneOrEmail, code);
        try {
            const response = await fetch(`${API_URL}/api/v1/2fa/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneOrEmail: phoneOrEmail,
                    code: code
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error verifying 2FA:', error);
            throw error;
        }
    }

    // Đổi mật khẩu
    async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>> {
        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch(`${this.baseUrl}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }

    // Upload avatar
    async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
        try {
            const token = localStorage.getItem('accessToken');
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch(`${this.baseUrl}/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw error;
        }
    }
}

export const patientService = new PatientService();
