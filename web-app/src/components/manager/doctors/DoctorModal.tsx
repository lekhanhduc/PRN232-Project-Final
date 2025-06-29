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
            gender: parseInt(formData.get('gender') as string) as Gender,
            yearsOfExperience: parseInt(formData.get('yearsOfExperience') as string),
            bio: formData.get('bio') as string,
            avatar: '',
        };

        if (doctor) {
            const updateData: DoctorUpdateRequest = {
                ...baseData,
                id: doctor.id,
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl overflow-y-auto max-h-[90vh]">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {doctor ? 'Chỉnh sửa Bác sĩ' : 'Thêm Bác sĩ mới'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Họ</label>
                            <input
                                name="lastName"
                                type="text"
                                defaultValue={doctor?.userName?.split(' ').slice(0, -1).join(' ') || ''}
                                required
                                className="input text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên</label>
                            <input
                                name="firstName"
                                type="text"
                                defaultValue={doctor?.userName?.split(' ').slice(-1)[0] || ''}
                                required
                                className="input text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                name="email"
                                type="email"
                                defaultValue={doctor?.userEmail || ''}
                                required
                                className="input text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                            <input
                                name="phone"
                                type="tel"
                                defaultValue={doctor?.userPhone || ''}
                                required
                                className="input text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Chuyên khoa</label>
                            <select
                                name="specialtyId"
                                //defaultValue={doctor?.specialtyId?.toString()}
                                required
                                className="input text-gray-700"
                            >
                                {specialties.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.specialtyName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bằng cấp</label>
                            <input
                                name="degree"
                                type="text"
                                defaultValue={doctor?.degree || ''}
                                className="input text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Số giấy phép</label>
                            <input
                                name="licenseNumber"
                                type="text"
                                defaultValue={doctor?.licenseNumber || ''}
                                required
                                className="input text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phí tư vấn</label>
                            <input
                                name="consultationFee"
                                type="number"
                                defaultValue={doctor?.consultationFee || 0}
                                required
                                className="input text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                            <select
                                name="gender"
                                defaultValue={doctor?.gender?.toString() || '0'}
                                className="input text-gray-700"
                            >
                                <option value="0">Nam</option>
                                <option value="1">Nữ</option>
                                <option value="2">Khác</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kinh nghiệm (năm)</label>
                            <input
                                name="yearsOfExperience"
                                type="number"
                                defaultValue={doctor?.yearsOfExperience || 0}
                                required
                                className="input text-gray-700"
                            />
                        </div>
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                            <input
                                name="avatar"
                                type="text"
                                defaultValue={doctor?.avatar || ''}
                                className="input"
                            />
                        </div> */}

                        {/* Chỉ hiển thị khi cập nhật */}
                        {doctor && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                <select
                                    name="isAvailable"
                                    defaultValue={doctor.isAvailable ? 'true' : 'false'}
                                    className="input text-gray-700"
                                >
                                    <option value="true">Đang hoạt động</option>
                                    <option value="false">Tạm nghỉ</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tiểu sử</label>
                        <textarea
                            name="bio"
                            defaultValue={doctor?.bio || ''}
                            rows={3}
                            className="input text-gray-700"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            {doctor ? 'Cập nhật' : 'Thêm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
