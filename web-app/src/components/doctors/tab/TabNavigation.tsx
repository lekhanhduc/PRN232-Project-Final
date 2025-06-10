'use client'
import { ActiveTab, TabItem } from '@/types/doctor';
import React from 'react';

interface TabNavigationProps {
    tabs: TabItem[];
    activeTab: ActiveTab;
    onTabChange: (tabId: ActiveTab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="border-b border-slate-200">
            <nav className="flex overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id as ActiveTab)}
                            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};
