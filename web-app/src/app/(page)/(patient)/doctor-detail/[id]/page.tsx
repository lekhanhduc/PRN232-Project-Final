'use client'
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Clock, Star, FileText, Stethoscope } from 'lucide-react';
import { TabNavigation } from '@/components/doctors/tab/TabNavigation';
import { ServicesTab } from '@/components/doctors/tab/ServicesTab';
import { OverviewTab } from '@/components/doctors/tab/OverviewTab';
import { ReviewsTab } from '@/components/doctors/tab/ReviewsTab';
import { AppointmentTab } from '@/components/doctors/tab/AppointmentTab';
import { WorkingHoursTab } from '@/components/doctors/tab/WorkingHoursTab';
import { DoctorHeroSection } from '@/components/doctors/details/DoctorHeroSection';
import { DoctorQuickStats } from '@/components/doctors/details/DoctorQuickStats';
import { useDoctorDetails } from '@/hooks/useDoctorDetails';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type ActiveTab = 'overview' | 'services' | 'reviews' | 'appointment' | 'hours';

export default function DoctorDetail() {
    const params = useParams();
    const doctorId = Number(params.id);
    const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
    const [isFavorite, setIsFavorite] = useState(false);

    const { doctor, loading, error } = useDoctorDetails(doctorId);

    const tabs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
        { id: 'overview', label: 'Overview', icon: FileText },
        { id: 'services', label: 'Services', icon: Stethoscope },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'appointment', label: 'Appointment', icon: Calendar },
        { id: 'hours', label: 'Working Hours', icon: Clock },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg max-w-md">
                    <h3 className="text-lg font-semibold mb-2">Error</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg max-w-md">
                    <h3 className="text-lg font-semibold mb-2">Doctor Not Found</h3>
                    <p>The doctor you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    const transformedDoctorData = {
        id: doctor.doctorId.toString(),
        name: doctor.fullName || 'Unknown Doctor',
        title: doctor.degree || 'Doctor',
        specialty: doctor.specialty?.specialtyName || 'General Practice',
        qualifications: doctor.licenseNumber || 'Licensed',
        experience: `${doctor.yearsOfExperience || 0}+ years`,
        rating: 4.8,
        reviews: 150,
        totalPatients: 1000,
        successRate: 95,
        about: doctor.bio || 'No biography available',
        education: [
            { degree: doctor.degree || 'Medical Degree', institution: 'Medical School', year: 'Graduated', honor: 'Licensed' },
        ],
        specializations: [doctor.specialty?.specialtyName || 'General Practice'],
        awards: [
            { title: 'Licensed Physician', organization: 'Medical Board', year: 'Current' },
        ],
        languages: ['Vietnamese', 'English'],
        services: [
            { name: 'Consultation', duration: '30 min', description: 'General consultation' },
            { name: 'Specialty Consultation', duration: '60 min', description: 'Specialty consultation' },
        ],
        workingHours: [
            { day: 'Monday', hours: '8:00 AM - 6:00 PM', available: doctor.isAvailable },
            { day: 'Tuesday', hours: '8:00 AM - 6:00 PM', available: doctor.isAvailable },
            { day: 'Wednesday', hours: '8:00 AM - 6:00 PM', available: doctor.isAvailable },
            { day: 'Thursday', hours: '8:00 AM - 6:00 PM', available: doctor.isAvailable },
            { day: 'Friday', hours: '8:00 AM - 4:00 PM', available: doctor.isAvailable },
            { day: 'Saturday', hours: '9:00 AM - 1:00 PM', available: false },
            { day: 'Sunday', hours: 'Emergency Only', available: false },
        ],
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.fullName || 'Doctor')}&size=200&background=3B82F6&color=fff`,
        verified: true,
        featured: true,
        acceptsInsurance: true,
        telemedicine: true,
        emergencyAvailable: doctor.isAvailable,
        consultationFee: doctor.consultationFee || 0
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
            <DoctorHeroSection
                doctor={transformedDoctorData}
                isFavorite={isFavorite}
                onToggleFavorite={() => setIsFavorite(!isFavorite)} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

                    <div className="xl:col-span-3">
                        <DoctorQuickStats doctor={transformedDoctorData} />

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 mb-8 overflow-hidden">
                            <TabNavigation
                                tabs={tabs}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />

                            <div className="p-8">
                                {activeTab === 'overview' && (
                                    <OverviewTab doctor={transformedDoctorData} />
                                )}

                                {activeTab === 'services' && (
                                    <ServicesTab services={transformedDoctorData.services} />
                                )}

                                {activeTab === 'reviews' && (
                                    <ReviewsTab reviews={transformedDoctorData.reviews} rating={transformedDoctorData.rating} />
                                )}

                                {activeTab === 'appointment' && (
                                    <AppointmentTab doctorId={doctorId} />
                                )}

                                {activeTab === 'hours' && (
                                    <WorkingHoursTab doctorId={doctorId} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}