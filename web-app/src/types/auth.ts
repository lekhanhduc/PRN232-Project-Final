export interface SignInRequest {
    emailOrPhone: string;
    password: string;
}

export interface SignInResponse {
    accessToken: string;
    refreshToken: string;
    userType: string;
    tokenType: string;
}