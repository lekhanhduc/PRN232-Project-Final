'use client';

import { useEffect, useState } from 'react';
import { DoctorsManagement } from '@/components/manager/doctors/DoctorsManagement';
import { getSpecialties } from '@/services/specialtyService';
import { SpecialtyDetailResponse } from '@/types/specialty';

export default function DoctorsPage() {
    const [specialties, setSpecialties] = useState<SpecialtyDetailResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const specialtyRes = await getSpecialties();
                setSpecialties(specialtyRes.result?.items || []);
            } catch (err) {
                console.error('Error loading specialties:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-4 text-gray-600">Đang tải dữ liệu...</div>;
    }

    return <DoctorsManagement specialties={specialties} />;
}
