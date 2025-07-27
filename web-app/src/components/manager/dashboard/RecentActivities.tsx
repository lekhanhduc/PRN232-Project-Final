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
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
                <div className="text-sm text-gray-500">
                    {activities.length} hoạt động
                </div>
            </div>
            <div className="space-y-4">
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className={`p-2 rounded-full flex-shrink-0 ${activity.status === 'completed'
                                    ? 'bg-green-100'
                                    : 'bg-yellow-100'
                                }`}>
                                {activity.status === 'completed' ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 mb-1">{activity.message}</p>
                                <div className="flex items-center space-x-2">
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${activity.status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {activity.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Không có hoạt động nào</p>
                    </div>
                )}
            </div>
        </div>
    );
}; 