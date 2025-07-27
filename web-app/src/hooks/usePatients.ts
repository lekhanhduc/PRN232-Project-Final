import { useState, useCallback, useEffect } from 'react';
import { receptionistService } from '@/services/receptionistService';
import { PatientDTOResponse } from '@/types/user';

export const usePatients = () => {
    const [patients, setPatients] = useState<PatientDTOResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const fetchPatients = useCallback(async (term: string, pageNum: number, size: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await receptionistService.getAllPatients(term, pageNum, size);
            if (response?.result?.items) {
                setPatients(response.result.items);
                setTotalPages(response.result.totalPages || 1);
                setTotalElements(response.result.totalElements || 0);
            } else {
                setPatients([]);
                setTotalPages(1);
                setTotalElements(0);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải danh sách bệnh nhân');
            setPatients([]);
            setTotalPages(1);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPatients(searchTerm, page, pageSize);
    }, [searchTerm, page, pageSize, fetchPatients]);

    return {
        patients,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        page,
        setPage,
        pageSize,
        setPageSize,
        totalPages,
        totalElements,
    };
};