'use client'
import { UserCheck, Users, Calendar, Building2 } from 'lucide-react';

interface QuickAction {
    id: string;
    title: string;
    icon: any;
    color: string;
    onClick: () => void;
}

interface QuickActionsProps {
    actions: QuickAction[];
}

export const QuickActions = ({ actions }: QuickActionsProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={action.onClick}
                        className={`p-4 ${action.color} rounded-lg hover:opacity-80 transition-opacity`}
                    >
                        <action.icon className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-sm font-medium text-white">{action.title}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}; 