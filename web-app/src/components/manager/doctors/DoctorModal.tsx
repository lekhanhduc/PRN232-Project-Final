'use client';

import { DoctorCreationRequest, DoctorUpdateRequest, Gender } from '@/types/doctor';
import { DoctorDetailResponse } from '@/types/doctor';
import { SpecialtyDetailResponse } from '@/types/specialty';

interface DoctorModalProps {
    isOpen: boolean;
    doctor: DoctorDetailResponse | null;
    specialties: SpecialtyDetailResponse[];
    onClose: () => void;
    onSubmit: (data: DoctorCreationRequest | DoctorUpdateRequest) => void;
}

export const DoctorModal = ({ isOpen, doctor, specialties, onClose, onSubmit }: DoctorModalProps) => {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const baseData = {
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            specialtyId: parseInt(formData.get('specialtyId') as string),
            licenseNumber: formData.get('licenseNumber') as string,
            degree: formData.get('degree') as string,
            consultationFee: parseFloat(formData.get('consultationFee') as string),
            gender: formData.get('gender') as Gender,
            yearsOfExperience: parseInt(formData.get('yearsOfExperience') as string),
            bio: formData.get('bio') as string,
            avatar: '',
        };

        if (doctor) {
            const updateData: DoctorUpdateRequest = {
                ...baseData,
                id: doctor.doctorId,
                isAvailable: formData.get('isAvailable') === 'true',
            };
            onSubmit(updateData);
        } else {
            const createData: DoctorCreationRequest = {
                ...baseData,
            };
            onSubmit(createData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-lg">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {doctor ? 'Chỉnh sửa Bác sĩ' : 'Thêm Bác sĩ mới'}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {doctor ? 'Cập nhật thông tin bác sĩ' : 'Điền thông tin để tạo tài khoản bác sĩ mới'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form id="doctor-form" onSubmit={handleSubmit} className="space-y-5">
                        {/* Thông tin cá nhân */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="text-base font-medium text-gray-800 mb-3">Thông tin cá nhân</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="lastName"
                                        type="text"
                                        defaultValue={doctor?.fullName?.split(' ').slice(0, -1).join(' ') || ''}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        placeholder="Nhập họ..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="firstName"
                                        type="text"
                                        defaultValue={doctor?.fullName?.split(' ').slice(-1)[0] || ''}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        placeholder="Nhập tên..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        defaultValue={doctor?.email || ''}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        placeholder="example@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        defaultValue={doctor?.phone || ''}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        placeholder="0123456789"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                                    <select
                                        name="gender"
                                        defaultValue={doctor?.gender?.toString() || 'MALE'}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                    >
                                        <option value="MALE">Nam</option>
                                        <option value="FEMALE">Nữ</option>
                                        <option value="OTHER">Khác</option>
                                    </select>
                                </div>
                                {doctor && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                        <select
                                            name="isAvailable"
                                            defaultValue={doctor.isAvailable ? 'true' : 'false'}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        >
                                            <option value="true">Đang hoạt động</option>
                                            <option value="false">Tạm nghỉ</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thông tin chuyên môn */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="text-base font-medium text-gray-800 mb-3">Thông tin chuyên môn</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Chuyên khoa <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="specialtyId"
                                        defaultValue={doctor?.specialty?.specialtyId?.toString() || ""}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                    >
                                        <option value="" disabled>Chọn chuyên khoa...</option>
                                        {specialties.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.specialtyName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bằng cấp</label>
                                    <input
                                        name="degree"
                                        type="text"
                                        defaultValue={doctor?.degree || ''}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        placeholder="Tiến sĩ, Thạc sĩ, Bác sĩ..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số giấy phép <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="licenseNumber"
                                        type="text"
                                        defaultValue={doctor?.licenseNumber || ''}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        placeholder="Số giấy phép hành nghề..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kinh nghiệm (năm) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="yearsOfExperience"
                                        type="number"
                                        min="0"
                                        max="50"
                                        defaultValue={doctor?.yearsOfExperience || 0}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phí tư vấn (VNĐ) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="consultationFee"
                                        type="number"
                                        min="0"
                                        step="1000"
                                        defaultValue={doctor?.consultationFee || 0}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        placeholder="500000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tiểu sử */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="text-base font-medium text-gray-800 mb-3">Tiểu sử</h4>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả về bác sĩ</label>
                                <textarea
                                    name="bio"
                                    defaultValue={doctor?.bio || ''}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700 resize-none"
                                    placeholder="Mô tả kinh nghiệm, chuyên môn và thành tích của bác sĩ..."
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {doctor ? 'Cập nhật thông tin' : 'Tạo tài khoản'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
