export interface Department {
    id: string;
    name: string;
    description: string;
    headDoctor: string;
    totalDoctors: number;
    totalPatients: number;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface SystemUser {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: 'admin' | 'manager' | 'doctor' | 'receptionist' | 'patient';
    department?: string;
    status: 'active' | 'inactive';
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ManagerStats {
    totalDoctors: number;
    totalPatients: number;
    totalAppointments: number;
    totalDepartments: number;
    appointmentsToday: number;
    newPatientsThisMonth: number;
    totalRevenue: number;
    pendingAppointments: number;
}

export interface ReportData {
    id: string;
    title: string;
    type: 'appointments' | 'patients' | 'doctors' | 'departments' | 'financial';
    dateRange: string;
    data: any;
    generatedAt: string;
    generatedBy: string;
}

export interface ActivityLog {
    id: string;
    action: string;
    description: string;
    userId: string;
    userName: string;
    timestamp: string;
    ipAddress?: string;
    userAgent?: string;
}

export interface DepartmentStats {
    departmentId: string;
    departmentName: string;
    totalAppointments: number;
    totalPatients: number;
    totalDoctors: number;
    averageRating: number;
    revenue: number;
}

export interface DoctorPerformance {
    doctorId: string;
    doctorName: string;
    department: string;
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    averageRating: number;
    totalPatients: number;
    workingHours: number;
}

export interface PatientAnalytics {
    totalPatients: number;
    newPatientsThisMonth: number;
    returningPatients: number;
    ageDistribution: {
        ageGroup: string;
        count: number;
        percentage: number;
    }[];
    genderDistribution: {
        gender: string;
        count: number;
        percentage: number;
    }[];
    topDepartments: {
        department: string;
        patientCount: number;
    }[];
}

export interface AppointmentAnalytics {
    totalAppointments: number;
    confirmedAppointments: number;
    pendingAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    dailyTrends: {
        date: string;
        count: number;
    }[];
    departmentBreakdown: {
        department: string;
        count: number;
    }[];
    statusDistribution: {
        status: string;
        count: number;
        percentage: number;
    }[];
} 