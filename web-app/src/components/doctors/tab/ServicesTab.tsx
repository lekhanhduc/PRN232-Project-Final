'use client'
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Service {
    name: string;
    duration: string;
    description: string;
}

interface ServicesTabProps {
    services: Service[];
}

export const ServicesTab: React.FC<ServicesTabProps> = ({ services }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Medical Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {service.duration}
                            </span>
                        </div>
                        <p className="text-slate-600 mb-4">{service.description}</p>
                        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
                            Learn more <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};