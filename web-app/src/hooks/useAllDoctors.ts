'use client'
import { useState, useEffect } from 'react';
import { doctorService } from '@/services/doctorService';
import { DoctorDetailResponse } from '@/types/doctor';
import { ApiResponse } from '@/types/apiResonse';
import { PageResponse } from '@/types/pageResponse';

interface UseAllDoctorsReturn {
    doctors: DoctorDetailResponse[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    totalElements: number;
    refetch: () => void;
}

export const useAllDoctors = (page: number = 1, pageSize: number = 8): UseAllDoctorsReturn => {
    const [doctors, setDoctors] = useState<DoctorDetailResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(page);
    const [totalElements, setTotalElements] = useState(0);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError(null);

            const response: ApiResponse<PageResponse<DoctorDetailResponse>> = await doctorService
                .getAllDoctors(page, pageSize);

            if (response.code === 200 && response.result) {
                setDoctors(response.result.items || []);
                setTotalPages(response.result.totalPages || 0);
                setCurrentPage(response.result.currentPages || page);
                setTotalElements(response.result.totalElements || 0);
            } else {
                setError('Failed to fetch doctors');
                setDoctors([]);
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setError(err instanceof Error ? err.message : 'An error occurred while fetching doctors');
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, [page, pageSize]);

    return {
        doctors,
        loading,
        error,
        totalPages,
        currentPage,
        totalElements,
        refetch: fetchDoctors
    };
};
