'use client'
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { PatientTable } from './PatientTable';

export const PatientList = () => {
    const { patients } = usePatients();
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewPatient, setShowNewPatient] = useState(false);

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Quản lý Bệnh nhân</h2>
                    <button
                        onClick={() => setShowNewPatient(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Thêm bệnh nhân</span>
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm bệnh nhân theo tên, số điện thoại hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <PatientTable patients={filteredPatients} />
        </div>
    );
};