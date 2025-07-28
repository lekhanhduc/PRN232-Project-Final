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
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Thao tác nhanh</h2>
            <div className="space-y-3">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={action.onClick}
                        className="w-full flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                        <div className={`p-3 ${action.color} rounded-lg group-hover:scale-105 transition-transform`}>
                            <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                                {action.title}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}; 