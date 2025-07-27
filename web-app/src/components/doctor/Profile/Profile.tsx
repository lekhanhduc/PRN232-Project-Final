"use client";

import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Info, Stethoscope, CreditCard, Edit3 } from 'lucide-react';
import { DoctorDetailResponse } from '@/types/doctor';
import { doctorService } from '@/services/doctorService';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [doctorProfile, setDoctorProfile] = useState<DoctorDetailResponse | null>(null);
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        if (!user?.id) {
          console.log('No user ID found');
          return;
        }
        
        console.log('Fetching doctor profile for ID:', user.id);
        setLoading(true);
        
        try {
          const response = await doctorService.getDoctorDetails(user.id);
          if (response.code === 200 && response.result) {
            console.log('Doctor profile loaded successfully:', response.result);
            setDoctorProfile(response.result);
          } else {
            console.error('API Error:', response);
            toast.error(response.message || 'Không thể tải thông tin bác sĩ');
          }
        } catch (apiError: any) {
          console.error('API Error:', apiError);
          if (apiError?.message?.includes('401')) {
            toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
          } else {
            toast.error(apiError?.message || 'Không thể tải thông tin bác sĩ');
          }
        }
      } catch (error: any) {
        console.error('Error in fetchDoctorProfile:', error);
        toast.error('Lỗi khi tải thông tin. Vui lòng thử lại sau');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [isLoggedIn]);
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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : doctorProfile ? (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <User className="text-blue-600" size={40} />
                </div>
                <div className="text-white">
                  <h3 className="text-2xl font-bold">{doctorProfile.fullName}</h3>
                  <p className="text-blue-100">{doctorProfile.specialty.specialtyName}</p>
                  <p className="text-blue-200 text-sm">{doctorProfile.yearsOfExperience} năm kinh nghiệm</p>
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
                      <CreditCard size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700">Phí tư vấn: {doctorProfile.consultationFee.toLocaleString('vi-VN')} VND</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Info size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {doctorProfile.isAvailable ? 
                          <span className="text-green-600">Đang làm việc</span> : 
                          <span className="text-red-600">Tạm nghỉ</span>}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                    <Stethoscope size={20} className="text-purple-600" />
                    Thông tin chuyên môn
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Học vấn:</p>
                      <p className="text-sm text-gray-800">{doctorProfile.degree}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Mã chứng chỉ hành nghề:</p>
                      <p className="text-sm text-gray-800">{doctorProfile.licenseNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tiểu sử:</p>
                      <p className="text-sm text-gray-800">{doctorProfile.bio || 'Chưa có thông tin'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Không thể tải thông tin bác sĩ
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;