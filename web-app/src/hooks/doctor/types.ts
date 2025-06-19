export type StatusType = 'confirmed' | 'pending' | 'completed' | 'approved' | 'rejected' | 'cancelled';

export interface ScheduleItem {
  id: number;
  patientName: string;
  phone: string;
  time: string;
  department: string;
  symptoms: string;
  status: StatusType;
  duration?: number;
  patientAge?: number;
  priority?: 'low' | 'medium' | 'high';
}

export interface AppointmentRequest {
  id: number;
  patientName: string;
  phone: string;
  requestedTime: string;
  department: string;
  symptoms: string;
  status: StatusType;
  requestDate: string;
  patientAge?: number;
  urgency?: 'low' | 'medium' | 'high';
}

export interface LeaveRequest {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: StatusType;
  requestDate: string;
  type: 'vacation' | 'sick' | 'conference' | 'emergency';
}

export interface DoctorProfile {
  name: string;
  specialization: string;
  experience: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  certifications: string[];
  avatar?: string;
  workingHours: string;
  languages: string[];
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
}

export interface DashboardStats {
  todayAppointments: number;
  completedToday: number;
  pendingRequests: number;
  upcomingAppointments: number;
}