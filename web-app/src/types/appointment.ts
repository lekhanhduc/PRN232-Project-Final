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

export interface DoctorInfoDto {
    doctorId: number;
    fullName: string;
    specialty: string;
    licenseNumber: string;
    degree: string;
    yearsOfExperience: number;
    consultationFee: number;
    bio: string;
    gender?: string;
    isAvailable: boolean;
}

export interface AppointmentResponse {
    appointmentId: number;
    appointmentNumber: string;
    doctor: DoctorInfoDto;
    appointmentDate: string;
    appointmentTime: string;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'rescheduled';
    totalFee: number;
    reasonForVisit: string;
    canCancel: boolean;
    canReschedule: boolean;
}

export interface CancelAppointmentRequest {
    cancelReason: string;
}

export interface RescheduleAppointmentRequest {
    newSlotId: number;
    newAppointmentDate: string;
    reason: string;
}

export interface RescheduleAppointmentResponse {
    appointmentId: number;
    newAppointmentDate: string;
    newAppointmentTime: string;
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

export interface AppointmentToday {
  appointmentId: number;
  appointmentTime: string;
  status: string;
  totalFee: number;
  patient: {
    fullName: string;
    phone: string;
  };
  doctor: {
    fullName: string;
    specialty: string;
  };
}