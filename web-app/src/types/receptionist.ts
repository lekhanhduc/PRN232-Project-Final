export interface Receptionist {
    userId: number;
    username: string;
    email: string;
    fullName: string;
    phone: string;
    isActive: boolean;
    createdAt: string;
}

export interface CreateReceptionistRequest {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
}

export interface UpdateReceptionistRequest {
    fullName: string;
    phone: string;
    isActive: boolean;
}

export interface ReceptionistResponse {
    success: boolean;
    message: string;
    data?: Receptionist[];
}

export interface CreateReceptionistResponse {
    success: boolean;
    message: string;
} 