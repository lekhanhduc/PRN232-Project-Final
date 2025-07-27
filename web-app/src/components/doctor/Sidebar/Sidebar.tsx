"use client";

import React from 'react';
import { User } from 'lucide-react';
import { MenuItem } from '@/hooks/doctor/types';

interface SidebarProps {
  menuItems: MenuItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ menuItems, activeTab, onTabChange }: SidebarProps) => {
  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <User className="text-white" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Hệ thống Bác sĩ</h2>
            <p className="text-sm text-gray-500">BS. Trần Thị Mai</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors relative ${activeTab === item.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Icon size={20} />
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;