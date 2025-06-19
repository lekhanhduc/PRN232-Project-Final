"use client";

import React from 'react';
import { User, Mail, Phone, MapPin, Clock, Edit3 } from 'lucide-react';
import { DoctorProfile } from '@/hooks/doctor/types';

interface ProfileProps {
  doctorProfile: DoctorProfile;
}

const Profile = ({ doctorProfile }: ProfileProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Hồ sơ Cá nhân</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Edit3 size={20} />
          Chỉnh sửa
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <User className="text-blue-600" size={40} />
            </div>
            <div className="text-white">
              <h3 className="text-2xl font-bold">{doctorProfile.name}</h3>
              <p className="text-blue-100">{doctorProfile.specialization}</p>
              <p className="text-blue-200 text-sm">{doctorProfile.experience}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                <Mail size={20} className="text-blue-600" />
                Thông tin liên hệ
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{doctorProfile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{doctorProfile.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{doctorProfile.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">Giờ làm việc: {doctorProfile.workingHours}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                <User size={20} className="text-purple-600" />
                Thông tin chuyên môn
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Học vấn:</p>
                  <p className="text-sm text-gray-800">{doctorProfile.education}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Chứng chỉ:</p>
                  <div className="space-y-1">
                    {doctorProfile.certifications.map((cert, index) => (
                      <span key={index} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2 mb-1">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Ngôn ngữ:</p>
                  <div className="space-y-1">
                    {doctorProfile.languages.map((lang, index) => (
                      <span key={index} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2 mb-1">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;