'use client'
import { useRouter, usePathname } from 'next/navigation';
import { 
    Users, 
    Calendar, 
    Building2, 
    UserCheck, 
    Settings, 
    BarChart3, 
    FileText,
    Shield,
    Home,
    UserPlus
} from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        { 
            id: 'dashboard', 
            label: 'Tổng quan', 
            icon: Home,
            path: '/manager'
        },
        { 
            id: 'doctors', 
            label: 'Quản lý Bác sĩ', 
            icon: UserCheck,
            path: '/manager/doctors'
        },
        { 
            id: 'receptionists', 
            label: 'Quản lý Lễ tân', 
            icon: UserPlus,
            path: '/manager/receptionists'
        },
        { 
            id: 'departments', 
            label: 'Khoa/Phòng ban', 
            icon: Building2,
            path: '/manager/departments'
        },
        { 
            id: 'appointments', 
            label: 'Lịch hẹn', 
            icon: Calendar,
            path: '/manager/appointments'
        },
        { 
            id: 'patients', 
            label: 'Bệnh nhân', 
            icon: Users,
            path: '/manager/patients'
        },
        { 
            id: 'reports', 
            label: 'Báo cáo', 
            icon: FileText,
            path: '/manager/reports'
        },
        { 
            id: 'users', 
            label: 'Người dùng', 
            icon: Shield,
            path: '/manager/users'
        },
        { 
            id: 'settings', 
            label: 'Cài đặt', 
            icon: Settings,
            path: '/manager/settings'
        }
    ];

    const handleMenuClick = (item: typeof menuItems[0]) => {
        onTabChange(item.id);
        router.push(item.path);
    };

    const isActive = (item: typeof menuItems[0]) => {
        return pathname === item.path || activeTab === item.id;
    };

    return (
        <div className="w-64 bg-white shadow-sm h-screen">
            <nav className="mt-8">
                <div className="px-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleMenuClick(item)}
                            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                                isActive(item)
                                    ? 'bg-slate-100 text-slate-700 border-r-2 border-slate-400 shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 mr-3 ${
                                isActive(item) ? 'text-slate-600' : 'text-slate-500'
                            }`} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
}; 