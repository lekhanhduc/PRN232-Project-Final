'use client';

import React from 'react';
import AppointmentHistory from '@/components/patient/AppointmentHistory/AppointmentHistory';

const AppointmentsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AppointmentHistory />
            </div>
        </div>
    );
};

export default AppointmentsPage; 