'use client'
import { AlertCircle, CheckCircle } from 'lucide-react';

interface Activity {
    id: number;
    type: 'appointment' | 'doctor' | 'patient' | 'department';
    message: string;
    time: string;
    status: 'pending' | 'completed';
}

interface RecentActivitiesProps {
    activities: Activity[];
}

export const RecentActivities = ({ activities }: RecentActivitiesProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h2>
            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                            activity.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                            {activity.status === 'completed' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 