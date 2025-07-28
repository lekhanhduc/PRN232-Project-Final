'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { PatientTable } from './PatientTable';
import { PatientDTOResponse } from "@/types/user";
import { receptionistService } from '@/services/receptionistService';
import { usePatients } from '@/hooks/usePatients';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export const PatientList = () => {
    const {
        patients,
        loading,
        setSearchTerm,
        page,
        setPage,
        pageSize,
        setPageSize,
        totalPages,
        totalElements
    } = usePatients();
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebounce(searchInput, 400);

    useEffect(() => {
        setSearchTerm(debouncedSearch);
    }, [debouncedSearch, setSearchTerm]);

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
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
            ) : (
                <>
                    <PatientTable patients={patients} />
                    {/* Pagination controls */}
                    <div className="flex items-center justify-between mt-4">
                        <div>
                            <button
                                className="px-3 py-1 border rounded mr-2 disabled:opacity-50"
                                onClick={() => setPage(page - 1)}
                                disabled={page <= 1}
                            >
                                Trang trước
                            </button>
                            <span>Trang {page} / {totalPages}</span>
                            <button
                                className="px-3 py-1 border rounded ml-2 disabled:opacity-50"
                                onClick={() => setPage(page + 1)}
                                disabled={page >= totalPages}
                            >
                                Trang sau
                            </button>
                        </div>
                        <div>
                            <span className="mr-2">Kích thước trang:</span>
                            <select
                                value={pageSize}
                                onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                                className="border rounded px-2 py-1"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className="ml-4 text-gray-500 text-sm">
                            Tổng số: {totalElements}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
