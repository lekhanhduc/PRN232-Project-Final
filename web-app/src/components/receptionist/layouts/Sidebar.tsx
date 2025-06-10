'use client'
import { Calendar, Users, Clock } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
    const menuItems = [
        { id: 'appointments', label: 'Lịch hẹn', icon: Calendar },
        { id: 'patients', label: 'Bệnh nhân', icon: Users },
        { id: 'schedule', label: 'Lịch bác sĩ', icon: Clock }
    ];

    return (
        <div className="w-64 bg-white shadow-sm h-screen">
            <nav className="mt-8">
                <div className="px-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${activeTab === item.id
                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
};