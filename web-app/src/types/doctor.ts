
export interface DoctorDetailResponse {
    doctorId: number;
    fullName: string;
    specialty: SpecialtyDto;
    email: string;
    phone?: string;
    avatar?: string;
    licenseNumber: string;
    degree?: string;
    consultationFee: number;
    isAvailable: boolean;
    gender?: Gender;
    yearsOfExperience: number;
    bio?: string;
}

export interface DoctorCreationRequest {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    specialtyId: number;
    licenseNumber: string;
    degree?: string;
    consultationFee: number;
    gender?: Gender;
    yearsOfExperience: number;
    bio?: string;
    avatar?: string;
}

export interface DoctorCreationResponse {
    id: number;
    userId: number;
    userName: string;
    userEmail: string;
    specialtyId?: number;
    specialtyName?: string;
    licenseNumber: string;
    degree?: string;
    consultationFee: number;
    isAvailable: boolean;
    gender?: Gender;
    yearsOfExperience: number;
    bio?: string;
    createdAt: string;
}

export interface DoctorUpdateRequest {
    id: number;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    specialtyId?: number;
    licenseNumber?: string;
    degree?: string;
    consultationFee?: number;
    isAvailable?: boolean;
    gender?: Gender;
    yearsOfExperience?: number;
    bio?: string;
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
    consultationFee: number;
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

export interface SpecialtyDto {
    specialtyId: number;
    specialtyName: string;
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