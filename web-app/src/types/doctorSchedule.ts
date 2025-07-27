// Updated types for doctor schedule system

export interface TimeSlotDoctorResponse {
  slotId: number;
  slotTime: string;
  slotTimeFormatted: string;
  isAvailable: boolean;
  appointment?: AppointmentSummaryResponse;
}

export interface AppointmentSummaryResponse {
  appointmentId: number;
  patient: PatientSummaryResponse;
  status?: string; // Added optional status for filtering
}

export interface PatientSummaryResponse {
  patientId: number;
  fullName: string;
  phone: string;
}

export interface WorkScheduleResponse {
  scheduleId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  maxPatients: number;
  isAvailable: boolean;
  timeSlots: TimeSlotDoctorResponse[];
}

export interface PatientInfoDetailResponse {
  patientId: number;
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  avatar?: string;
}

export interface ServicePackageResponse {
  packageId: number;
  packageName: string;
  description: string;
  fee: number;
  durationMinutes: number;
}

export interface DoctorAppointmentResponse {
  appointmentId: number;
  patient: PatientInfoDetailResponse;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  reasonForVisit: string;
  totalFee: number;
  consultationFee: number;
  servicePackage?: ServicePackageResponse;
  createdAt: string;
}

export interface CompleteAppointmentRequest {
  notes?: string;
}

export interface LeaveRequestPayload {
  leaveDate: string;
  reason: string;
}

export interface LeaveResponse {
  leaveId: number;
  doctorId: number;
  leaveDate: string;
  reason: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Added missing interfaces
export interface DoctorProfile {
  name: string;
  specialization: string;
  experience: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  certifications: string[];
  workingHours: string;
  languages: string[];
}

export interface DashboardStats {
  todayAppointments: number;
  completedToday: number;
  pendingRequests: number;
  upcomingAppointments: number;
}