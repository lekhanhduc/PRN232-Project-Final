import { useState, useEffect } from 'react';
import { DoctorSearchResponse, Gender } from '@/types/doctor';
import { doctorService, SearchDoctorsParams } from '@/services/doctorService';

export const useDoctors = () => {
    const [doctors, setDoctors] = useState<DoctorSearchResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);

    const searchDoctors = async (params: SearchDoctorsParams = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await doctorService.searchDoctors({
                ...params,
                page: currentPage,
                pageSize: pageSize
            });

            if (response.code === 200 && response.result) {
                setDoctors(response.result.items);
                setTotalPages(response.result.totalPages);
                setTotalElements(response.result.totalElements);
            } else {
                setError(response.message || 'Failed to fetch doctors');
            }
        } catch (err) {
            console.error('🔍 Debug - Hook error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        searchDoctors();
    }, [currentPage]);

    return {
        doctors,
        loading,
        error,
        currentPage,
        totalPages,
        totalElements,
        searchDoctors,
        setCurrentPage
    };
}; 