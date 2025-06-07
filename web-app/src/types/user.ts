export interface UserCreationRequest {
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: string;
}

export interface UserCreationResponse {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    dob: string;
    userType: string;
}