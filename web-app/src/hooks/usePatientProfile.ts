import { useState, useEffect } from 'react';
import { PatientDetailResponse, PatientDetailRequest, Gender } from '@/types/user';
import { patientService } from '@/services/patientService';

interface UsePatientProfileReturn {
    patient: PatientDetailResponse | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    loadProfile: () => Promise<void>;
    updateProfile: (data: PatientDetailRequest) => Promise<boolean>;
    refreshProfile: () => Promise<void>;
}

export const usePatientProfile = (): UsePatientProfileReturn => {
    const [patient, setPatient] = useState<PatientDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await patientService.getPatientProfile();
            
            if (response.code === 200 && response.result) {
                setPatient(response.result);
            } else {
                setError(response.message || 'Không thể tải thông tin hồ sơ');
            }
        } catch (err) {
            console.error('Error loading patient profile:', err);
            setError('Không thể tải thông tin hồ sơ');
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (data: PatientDetailRequest): Promise<boolean> => {
        try {
            setSaving(true);
            setError(null);
            const response = await patientService.updatePatientProfile(data);
            
            if (response.code === 200 && response.result) {
                setPatient(response.result);
                return true;
            } else {
                setError(response.message || 'Không thể cập nhật thông tin');
                return false;
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Không thể cập nhật thông tin');
            return false;
        } finally {
            setSaving(false);
        }
    };

    const refreshProfile = async () => {
        await loadProfile();
    };

    useEffect(() => {
        loadProfile();
    }, []);

    return {
        patient,
        loading,
        saving,
        error,
        loadProfile,
        updateProfile,
        refreshProfile,
    };
};
