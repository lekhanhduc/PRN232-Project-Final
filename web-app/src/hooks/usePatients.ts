import { useState, useCallback } from 'react';

interface Patient {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    birthDate: string;
    gender: string;
    lastVisit?: string;
    medicalHistory?: string[];
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
}

interface NewPatient extends Omit<Patient, 'id'> { }

interface UsePatients {
    patients: Patient[];
    loading: boolean;
    error: string | null;
    addPatient: (patient: NewPatient) => void;
    updatePatient: (id: string, updates: Partial<Patient>) => void;
    deletePatient: (id: string) => void;
    getPatientById: (id: string) => Patient | undefined;
    searchPatients: (searchTerm: string) => Patient[];
    getPatientsByAge: (minAge: number, maxAge: number) => Patient[];
}

const initialPatients: Patient[] = [
    {
        id: 'P1',
        name: 'Nguyễn Văn An',
        phone: '0901234567',
        email: 'nva@email.com',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        birthDate: '1980-05-15',
        gender: 'Nam',
        lastVisit: '2025-05-20',
        medicalHistory: ['Tăng huyết áp', 'Tiểu đường type 2'],
        emergencyContact: {
            name: 'Nguyễn Thị Bình',
            phone: '0901234568',
            relationship: 'Vợ'
        }
    },
    {
        id: 'P2',
        name: 'Lê Thị Bình',
        phone: '0987654321',
        email: 'ltb@email.com',
        address: '456 Đường XYZ, Quận 3, TP.HCM',
        birthDate: '1975-12-03',
        gender: 'Nữ',
        lastVisit: '2025-04-18',
        medicalHistory: ['Dị ứng thuốc kháng sinh'],
        emergencyContact: {
            name: 'Lê Văn Cường',
            phone: '0987654322',
            relationship: 'Chồng'
        }
    },
    {
        id: 'P3',
        name: 'Trần Minh Tuấn',
        phone: '0912345678',
        email: 'tmt@email.com',
        address: '789 Đường DEF, Quận 5, TP.HCM',
        birthDate: '1990-08-22',
        gender: 'Nam',
        lastVisit: '2025-06-05',
        medicalHistory: [],
        emergencyContact: {
            name: 'Trần Thị Mai',
            phone: '0912345679',
            relationship: 'Mẹ'
        }
    },
    {
        id: 'P4',
        name: 'Phạm Thị Lan',
        phone: '0945678901',
        email: 'ptl@email.com',
        address: '321 Đường GHI, Quận 7, TP.HCM',
        birthDate: '1985-11-10',
        gender: 'Nữ',
        lastVisit: '2025-03-28',
        medicalHistory: ['Hen suyễn', 'Viêm xoang mãn tính'],
        emergencyContact: {
            name: 'Phạm Văn Đức',
            phone: '0945678902',
            relationship: 'Anh trai'
        }
    }
];

export const usePatients = (): UsePatients => {
    const [patients, setPatients] = useState<Patient[]>(initialPatients);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Generate unique ID for new patient
    const generateId = useCallback(() => {
        const maxId = patients.reduce((max, patient) => {
            const numId = parseInt(patient.id.substring(1));
            return numId > max ? numId : max;
        }, 0);
        return `P${maxId + 1}`;
    }, [patients]);

    // Add new patient
    const addPatient = useCallback((newPatient: NewPatient) => {
        try {
            setLoading(true);
            setError(null);

            // Validate required fields
            if (!newPatient.name.trim()) {
                throw new Error('Tên bệnh nhân là bắt buộc');
            }
            if (!newPatient.phone.trim()) {
                throw new Error('Số điện thoại là bắt buộc');
            }
            if (!newPatient.birthDate) {
                throw new Error('Ngày sinh là bắt buộc');
            }

            // Check for duplicate phone number
            const existingPatient = patients.find(p => p.phone === newPatient.phone);
            if (existingPatient) {
                throw new Error('Số điện thoại đã tồn tại trong hệ thống');
            }

            const patient: Patient = {
                ...newPatient,
                id: generateId(),
                medicalHistory: newPatient.medicalHistory || [],
            };

            setPatients(prev => [...prev, patient]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi thêm bệnh nhân');
        } finally {
            setLoading(false);
        }
    }, [patients, generateId]);

    // Update patient
    const updatePatient = useCallback((id: string, updates: Partial<Patient>) => {
        try {
            setLoading(true);
            setError(null);

            // Check if patient exists
            const existingPatient = patients.find(p => p.id === id);
            if (!existingPatient) {
                throw new Error('Không tìm thấy bệnh nhân');
            }

            // If updating phone, check for duplicates
            if (updates.phone && updates.phone !== existingPatient.phone) {
                const duplicatePhone = patients.find(p => p.id !== id && p.phone === updates.phone);
                if (duplicatePhone) {
                    throw new Error('Số điện thoại đã tồn tại trong hệ thống');
                }
            }

            setPatients(prev => prev.map(patient =>
                patient.id === id ? { ...patient, ...updates } : patient
            ));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật bệnh nhân');
        } finally {
            setLoading(false);
        }
    }, [patients]);

    // Delete patient
    const deletePatient = useCallback((id: string) => {
        try {
            setLoading(true);
            setError(null);

            const patientExists = patients.some(p => p.id === id);
            if (!patientExists) {
                throw new Error('Không tìm thấy bệnh nhân');
            }

            setPatients(prev => prev.filter(patient => patient.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa bệnh nhân');
        } finally {
            setLoading(false);
        }
    }, [patients]);

    // Get patient by ID
    const getPatientById = useCallback((id: string): Patient | undefined => {
        return patients.find(patient => patient.id === id);
    }, [patients]);

    // Search patients
    const searchPatients = useCallback((searchTerm: string): Patient[] => {
        if (!searchTerm.trim()) return patients;

        const term = searchTerm.toLowerCase();
        return patients.filter(patient =>
            patient.name.toLowerCase().includes(term) ||
            patient.phone.includes(term) ||
            patient.email.toLowerCase().includes(term) ||
            patient.address.toLowerCase().includes(term)
        );
    }, [patients]);

    // Get patients by age range
    const getPatientsByAge = useCallback((minAge: number, maxAge: number): Patient[] => {
        const currentYear = new Date().getFullYear();
        return patients.filter(patient => {
            const birthYear = new Date(patient.birthDate).getFullYear();
            const age = currentYear - birthYear;
            return age >= minAge && age <= maxAge;
        });
    }, [patients]);

    return {
        patients,
        loading,
        error,
        addPatient,
        updatePatient,
        deletePatient,
        getPatientById,
        searchPatients,
        getPatientsByAge,
    };
};