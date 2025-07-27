import { useState, useCallback, useEffect } from 'react';
import { receptionistService } from '@/services/receptionistService';
import { PatientDTOResponse } from '@/types/user';

export const usePatients = () => {
    const [patients, setPatients] = useState<PatientDTOResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPatients = useCallback(async (term: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await receptionistService.getAllPatients(term);
            if (response?.result?.items) {
                setPatients(response.result.items);
            } else {
                setPatients([]);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải danh sách bệnh nhân');
            setPatients([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPatients(searchTerm);
    }, [searchTerm, fetchPatients]);

    return {
        patients,
        loading,
        error,
        setSearchTerm,
    };
};