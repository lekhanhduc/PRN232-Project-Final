'use client'
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { DoctorData } from '../../../types/doctor';

interface OverviewTabProps {
    doctor: DoctorData;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ doctor }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About Dr. {doctor.name.split(' ')[1]}</h2>
                <div className={`text-slate-700 leading-relaxed text-lg ${expanded ? '' : 'line-clamp-4'}`}>
                    {doctor.about}
                </div>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-3 text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                >
                    {expanded ? (
                        <>Show less <ChevronUp className="w-4 h-4" /></>
                    ) : (
                        <>Read more <ChevronDown className="w-4 h-4" /></>
                    )}
                </button>
            </div>

            <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Medical Specializations</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {doctor.specializations.map((spec, index) => (
                        <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-slate-800 font-medium">{spec}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Languages Spoken</h3>
                <div className="flex flex-wrap gap-3">
                    {doctor.languages.map((language, index) => (
                        <span key={index} className="flex items-center gap-2 bg-slate-100 text-slate-800 px-4 py-2 rounded-xl font-medium">
                            <Globe className="w-4 h-4" />
                            {language}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};