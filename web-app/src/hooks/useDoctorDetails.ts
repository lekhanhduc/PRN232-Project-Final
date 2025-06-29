import { useState, useEffect } from 'react';
import { DoctorDetailResponse } from '@/types/doctor';
import { doctorService } from '@/services/doctorService';

export const useDoctorDetails = (doctorId: number) => {
    const [doctor, setDoctor] = useState<DoctorDetailResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDoctorDetails = async () => {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Debug - Hook fetchDoctorDetails called with doctorId:', doctorId);
        
        try {
            const response = await doctorService.getDoctorDetails(doctorId);
            
            console.log('🔍 Debug - Hook received doctor details response:', response);
            
            if (response.code === 200 && response.result) {
                setDoctor(response.result);
            } else {
                setError(response.message || 'Failed to fetch doctor details');
            }
        } catch (err) {
            console.error('🔍 Debug - Hook error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (doctorId) {
            fetchDoctorDetails();
        }
    }, [doctorId]);

    return {
        doctor,
        loading,
        error,
        refetch: fetchDoctorDetails
    };
}; 