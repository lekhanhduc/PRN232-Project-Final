'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';


interface UploadScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (file: File) => void;
}

export const UploadScheduleModal = ({ isOpen, onClose,onSubmit }: UploadScheduleModalProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error('Vui lòng chọn file Excel');
            return;
        }

        try {
            setLoading(true);
            await onSubmit(file); 
            onClose();
        } catch (error) {
            toast.error('Tải lên thất bại!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tải lên lịch làm việc</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Chọn file Excel</label>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="mt-1 text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none px-3 py-2 w-auto"
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
                            disabled={loading}
                            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            {loading ? 'Đang tải...' : 'Tải lên'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
