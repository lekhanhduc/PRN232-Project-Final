'use client'

import React from 'react';

const PageHeader: React.FC = () => {
    return (
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                Tìm Bác Sĩ Chuyên Khoa
            </h1>
            <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                Khám phá mạng lưới bác sĩ chuyên môn cao và đặt lịch hẹn ngay hôm nay.
            </p>
        </div>
    );
};

export default PageHeader;