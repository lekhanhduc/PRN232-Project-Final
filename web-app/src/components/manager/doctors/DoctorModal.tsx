'use client'
import { Doctor } from '@/types/doctor';

interface DoctorModalProps {
    isOpen: boolean;
    doctor: Doctor | null;
    departments: string[];
    onClose: () => void;
    onSubmit: (data: Partial<Doctor>) => void;
}

export const DoctorModal = ({ isOpen, doctor, departments, onClose, onSubmit }: DoctorModalProps) => {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            name: formData.get('name') as string,
            department: formData.get('department') as string,
            status: formData.get('status') as 'available' | 'busy' | 'off',
        };
        onSubmit(data);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {doctor ? 'Chỉnh sửa Bác sĩ' : 'Thêm Bác sĩ mới'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên bác sĩ</label>
                        <input
                            name="name"
                            type="text"
                            defaultValue={doctor?.name || ''}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Khoa</label>
                        <select 
                            name="department"
                            defaultValue={doctor?.department || departments[1]}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            {departments.slice(1).map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                        <select 
                            name="status"
                            defaultValue={doctor?.status || 'available'}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="available">Có sẵn</option>
                            <option value="busy">Bận</option>
                            <option value="off">Nghỉ</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            {doctor ? 'Cập nhật' : 'Thêm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 