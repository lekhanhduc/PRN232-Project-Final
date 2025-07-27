'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { PatientTable } from './PatientTable';
import { PatientDTOResponse } from "@/types/user";
import { receptionistService } from '@/services/receptionistService';
import { usePatients } from '@/hooks/usePatients';

export const PatientList = () => {
    const { patients, loading, setSearchTerm } = usePatients();
    const [showNewPatient, setShowNewPatient] = useState(false);

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
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
            ) : (
                <PatientTable patients={patients} />
            )}
        </div>
    );
};
