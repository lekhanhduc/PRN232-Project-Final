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
    email: string;  
    phone: string;
    userStatus: number;
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

export interface ReceptionistManagerResponse {
  id: number;
  email: string;
  phone: string;
  userStatus: number;
  createdAt: string;  
}

export interface ReceptionistResponse {
  id: number;
  email: string;
  phone: string;
  userStatus: boolean;
  createdAt: string;  
}
