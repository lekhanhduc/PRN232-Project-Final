'use client'

import React from 'react';
import { Calendar, Clock, FileText, Star, Stethoscope } from 'lucide-react';
import { TabNavigation } from './TabNavigation';
import { TabContent } from './TabContent';
import { DoctorData, ActiveTab, TabItem } from '../../../types/doctor';
import { OverviewTab } from './OverviewTab';
import { ServicesTab } from './ServicesTab';
import { ReviewsTab } from './ReviewsTab';
import { AppointmentTab } from './AppointmentTab';
import { WorkingHoursTab } from './WorkingHoursTab';

interface DoctorTabsProps {
    doctor: DoctorData;
    activeTab: ActiveTab;
    onTabChange: (tabId: ActiveTab) => void;
}

export const DoctorTabs: React.FC<DoctorTabsProps> = ({ doctor, activeTab, onTabChange }) => {
    const tabs: TabItem[] = [
        { id: 'overview', label: 'Overview', icon: FileText },
        { id: 'services', label: 'Services', icon: Stethoscope },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'appointment', label: 'Appointment', icon: Calendar },
        { id: 'hours', label: 'Working Hours', icon: Clock },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab doctor={doctor} />;
            case 'services':
                return <ServicesTab services={doctor.services} />;
            case 'reviews':
                return <ReviewsTab rating={doctor.rating} reviews={doctor.reviews} />;
            case 'appointment':
                return <AppointmentTab doctorId={Number(doctor.id)} />;
            case 'hours':
                return <WorkingHoursTab doctorId={Number(doctor.id)} />;
            default:
                return <OverviewTab doctor={doctor} />;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 mb-8 overflow-hidden">
            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
            <TabContent>
                {renderTabContent()}
            </TabContent>
        </div>
    );
};