export interface Patient {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    birthDate: string;
    gender: string;
    lastVisit?: string;
}

export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    phone: string;
    doctorName: string;
    department: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
    symptoms: string;
    notes?: string;
}