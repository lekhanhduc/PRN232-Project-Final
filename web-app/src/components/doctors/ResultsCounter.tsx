'use client'
import React from 'react';

interface ResultsCounterProps {
    count: number;
}

const ResultsCounter: React.FC<ResultsCounterProps> = ({ count }) => {
    return (
        <div className="mb-8">
            <p className="text-gray-600 text-lg font-medium">
                Hiển thị <span className="font-bold text-blue-600">{count}</span> bác sĩ
            </p>
        </div>
    );
};

export default ResultsCounter;