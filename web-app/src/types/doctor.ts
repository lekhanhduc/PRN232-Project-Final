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