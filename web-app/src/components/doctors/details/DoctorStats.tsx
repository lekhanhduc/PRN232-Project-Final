'use client'

import React from 'react';
import { Star, Users, TrendingUp } from 'lucide-react';

interface DoctorStatsProps {
    rating: number;
    reviews: number;
    totalPatients: number;
    successRate: number;
}

export const DoctorStats: React.FC<DoctorStatsProps> = ({
    rating,
    reviews,
    totalPatients,
    successRate
}) => {
    return (
        <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-white">{rating}</span>
                <span className="text-blue-200">({reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-300" />
                <span className="text-white">{totalPatients}+ patients</span>
            </div>
            <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-white">{successRate}% success rate</span>
            </div>
        </div>
    );
};