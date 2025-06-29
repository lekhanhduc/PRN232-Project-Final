'use client';

import { useEffect, useState } from 'react';
import { DoctorsManagement } from '@/components/manager/doctors/DoctorsManagement';
import { getDoctors } from '@/services/doctorService';
import { getSpecialties } from '@/services/specialtyService';
import { DoctorDetailResponse } from '@/types/doctor';
import { SpecialtyDetailResponse } from '@/types/specialty';

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<DoctorDetailResponse[]>([]);
    const [specialties, setSpecialties] = useState<SpecialtyDetailResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doctorRes, specialtyRes] = await Promise.all([
                    getDoctors(),
                    getSpecialties()
                ]);

                setDoctors(doctorRes.result?.items || []);
                setSpecialties(specialtyRes.result?.items || []);
            } catch (err) {
                console.error('Error loading doctors or specialties:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-4 text-gray-600">Đang tải danh sách bác sĩ...</div>;
    }

    return <DoctorsManagement doctors={doctors} specialties={specialties} />;
}
