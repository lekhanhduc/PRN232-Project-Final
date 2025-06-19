'use client'
import React, { useState } from 'react';
import { Calendar, Clock, Star, FileText, Stethoscope } from 'lucide-react';
import { TabNavigation } from '@/components/doctors/tab/TabNavigation';
import { ServicesTab } from '@/components/doctors/tab/ServicesTab';
import { OverviewTab } from '@/components/doctors/tab/OverviewTab';
import { ReviewsTab } from '@/components/doctors/tab/ReviewsTab';
import { AppointmentTab } from '@/components/doctors/tab/AppointmentTab';
import { WorkingHoursTab } from '@/components/doctors/tab/WorkingHoursTab';
import { DoctorHeroSection } from '@/components/doctors/details/DoctorHeroSection';
import { DoctorQuickStats } from '@/components/doctors/details/DoctorQuickStats';

const doctorData = {
    id: '123',
    name: 'Dr. Sarah Johnson',
    title: 'Senior Cardiologist & Heart Surgeon',
    specialty: 'Interventional Cardiology',
    qualifications: 'MD, PhD, FACC, FSCAI',
    experience: '15+ years',
    rating: 4.9,
    reviews: 347,
    totalPatients: 2500,
    successRate: 98.5,
    about: 'Dr. Sarah Johnson is a world-renowned interventional cardiologist with over 15 years of specialized experience in complex cardiac procedures. She has pioneered several minimally invasive techniques and has been recognized internationally for her contributions to cardiovascular medicine. Dr. Johnson combines cutting-edge technology with compassionate patient care, ensuring the best possible outcomes for her patients.',
    education: [
        { degree: 'Doctor of Medicine (MD)', institution: 'Harvard Medical School', year: '2008', honor: 'Magna Cum Laude' },
        { degree: 'PhD in Cardiovascular Research', institution: 'Johns Hopkins University', year: '2006', honor: 'Summa Cum Laude' },
        { degree: 'Residency - Internal Medicine', institution: 'Massachusetts General Hospital', year: '2011', honor: 'Chief Resident' },
        { degree: 'Fellowship - Interventional Cardiology', institution: 'Cleveland Clinic Foundation', year: '2014', honor: 'Outstanding Fellow Award' },
    ],
    specializations: [
        'Complex Coronary Interventions',
        'Structural Heart Disease',
        'Advanced Cardiac Imaging',
        'Heart Failure Management',
        'Preventive Cardiology',
        'Women\'s Heart Health'
    ],
    awards: [
        { title: 'Top Doctor in America', organization: 'Castle Connolly', year: '2023' },
        { title: 'Excellence in Cardiac Innovation', organization: 'American Heart Association', year: '2022' },
        { title: 'Physician of the Year', organization: 'New York Medical Society', year: '2021' },
        { title: 'Research Excellence Award', organization: 'Journal of Cardiology', year: '2020' },
    ],
    languages: ['English', 'Spanish', 'French', 'Mandarin'],
    services: [
        { name: 'Cardiac Consultation', duration: '60 min', description: 'Comprehensive heart health evaluation' },
        { name: 'Coronary Angiography', duration: '90 min', description: 'Advanced cardiac imaging procedure' },
        { name: 'Angioplasty & Stenting', duration: '120 min', description: 'Minimally invasive artery opening' },
        { name: 'Echocardiography', duration: '45 min', description: 'Ultrasound heart examination' },
        { name: 'Stress Testing', duration: '60 min', description: 'Heart performance under stress' },
        { name: 'Cardiac Rehabilitation', duration: '90 min', description: 'Post-procedure recovery program' },
    ],
    workingHours: [
        { day: 'Monday', hours: '8:00 AM - 6:00 PM', available: true },
        { day: 'Tuesday', hours: '8:00 AM - 6:00 PM', available: true },
        { day: 'Wednesday', hours: '8:00 AM - 6:00 PM', available: true },
        { day: 'Thursday', hours: '8:00 AM - 6:00 PM', available: true },
        { day: 'Friday', hours: '8:00 AM - 4:00 PM', available: true },
        { day: 'Saturday', hours: '9:00 AM - 1:00 PM', available: true },
        { day: 'Sunday', hours: 'Emergency Only', available: false },
    ],
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
    verified: true,
    featured: true,
    acceptsInsurance: true,
    telemedicine: true,
    emergencyAvailable: true
};

type ActiveTab = 'overview' | 'services' | 'reviews' | 'appointment' | 'hours';

export default function DoctorDetail() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
    const [isFavorite, setIsFavorite] = useState(false);

    const tabs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
        { id: 'overview', label: 'Overview', icon: FileText },
        { id: 'services', label: 'Services', icon: Stethoscope },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'appointment', label: 'Appointment', icon: Calendar },
        { id: 'hours', label: 'Working Hours', icon: Clock },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
            <DoctorHeroSection
                doctor={doctorData}
                isFavorite={isFavorite}
                onToggleFavorite={() => setIsFavorite(!isFavorite)} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

                    <div className="xl:col-span-3">
                        <DoctorQuickStats doctor={doctorData} />

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 mb-8 overflow-hidden">
                            <TabNavigation
                                tabs={tabs}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />

                            <div className="p-8">
                                {activeTab === 'overview' && (
                                    <OverviewTab doctor={doctorData} />
                                )}

                                {activeTab === 'services' && (
                                    <ServicesTab services={doctorData.services} />
                                )}

                                {activeTab === 'reviews' && (
                                    <ReviewsTab reviews={doctorData.reviews} rating={doctorData.rating} />
                                )}

                                {activeTab === 'appointment' && (
                                    <AppointmentTab />
                                )}

                                {activeTab === 'hours' && (
                                    <WorkingHoursTab workingHours={doctorData.workingHours} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}