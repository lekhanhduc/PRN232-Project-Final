export interface Doctor {
    id: string;
    name: string;
    department: string;
    schedule: {
        weekdays: string;
        saturday?: string;
        sunday?: string;
    };
    status: 'available' | 'busy' | 'off';
    avatar?: string;
}

export interface Education {
    degree: string;
    institution: string;
    year: string;
    honor: string;
}

export interface Award {
    title: string;
    organization: string;
    year: string;
}

export interface Service {
    name: string;
    duration: string;
    description: string;
}

export interface WorkingHour {
    day: string;
    hours: string;
    available: boolean;
}

export interface Review {
    id: string;
    patientName: string;
    rating: number;
    comment: string;
    date: string;
    avatar: string;
}

export interface DoctorData {
    id: string;
    name: string;
    title: string;
    specialty: string;
    qualifications: string;
    experience: string;
    rating: number;
    reviews: number;
    totalPatients: number;
    successRate: number;
    about: string;
    education: Education[];
    specializations: string[];
    awards: Award[];
    languages: string[];
    services: Service[];
    workingHours: WorkingHour[];
    image: string;
    verified: boolean;
    featured: boolean;
    acceptsInsurance: boolean;
    telemedicine: boolean;
    emergencyAvailable: boolean;
}

export interface DateInfo {
    day: string;
    date: number;
    month: string;
}

export interface TabItem {
    id: string;
    label: string;
    icon: any;
}

export type AppointmentType = 'in-person' | 'telehealth';
export type ActiveTab = 'overview' | 'services' | 'reviews' | 'appointment' | 'hours';

// API Backend Types
export interface DoctorSearchResponse {
    doctorId: number;
    fullName: string;
    academicTitle: string;
    specialty: SpecialtyDto;
    gender?: Gender;
    yearsOfExperience: number;
    consultationFee: number;
    bio: string;
    workSchedules: WorkScheduleDto[];
}

export interface DoctorDetailResponse {
    doctorId: number;
    fullName: string;
    specialty: SpecialtyDetailDto;
    licenseNumber: string;
    degree: string;
    yearsOfExperience: number;
    consultationFee: number;
    bio: string;
    gender?: Gender;
    isAvailable: boolean;
}

export interface SpecialtyDto {
    id: number;
    name: string;
}

export interface SpecialtyDetailDto {
    specialtyId: number;
    specialtyName: string;
    description: string;
}

export interface WorkScheduleDto {
    scheduleId: number;
    workDate: string;
    startTime: string;
    endTime: string;
    timeSlots: TimeSlotDto[];
}

export interface TimeSlotDto {
    slotId: number;
    slotTime: string;
    isAvailable: boolean;
}

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other'
}

export interface PatientInfoResponse {
  patientId: number;
  fullName: string;
  phone?: string;
  dateOfBirth: string; 
  gender?: string;    
}

export interface DoctorAppointmentResponse {
  appointmentId: number;
  patient?: PatientInfoResponse | null;
  patientName: string;
  appointmentDate: string;     
  appointmentTime: string;     
  status: string;
  reasonForVisit?: string;
  consultationFee: number;
  totalFee: number;
}
export interface PatientInfoResponse {
  patientId: number;
  fullName: string;
  phone?: string;
  dateOfBirth: string;
  gender?: string;
}

export interface AppointmentSummaryResponse {
  appointmentId: number;
  patient: PatientInfoResponse;
}

export interface TimeSlotResponse {
  slotId: number;
  slotTime: string; 
  isAvailable: boolean;
  appointment?: AppointmentSummaryResponse | null;
}

export interface WorkScheduleResponse {
  scheduleId: number;
  workDate: string; 
  startTime: string; 
  endTime: string;
  maxPatients: number;
  timeSlots: TimeSlotResponse[];
status: string;
time: string;
department: string;

}
