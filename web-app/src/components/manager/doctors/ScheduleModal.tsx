'use client';

import { useState } from 'react';
import { DoctorDetailResponse } from '@/types/doctor';

interface ScheduleModalProps {
  isOpen: boolean;
  doctor: DoctorDetailResponse | null;
  onClose: () => void;
  //onSubmit: (data: WorkScheduleDto) => void;
}

export const ScheduleModal = ({ isOpen, onClose }: ScheduleModalProps) => {
  const [workDate, setWorkDate] = useState('');
  const [timeSlots, setTimeSlots] = useState<string[]>(['']);

  if (!isOpen) return null;

  const handleAddSlot = () => setTimeSlots([...timeSlots, '']);

  const handleRemoveSlot = (index: number) => {
    const updated = [...timeSlots];
    updated.splice(index, 1);
    setTimeSlots(updated);
  };

  const handleSlotChange = (index: number, value: string) => {
    const updated = [...timeSlots];
    updated[index] = value;
    setTimeSlots(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl overflow-y-auto max-h-[90vh]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tạo Lịch Làm Việc</h3>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngày làm việc</label>
              <input
                type="date"
                value={workDate}
                onChange={e => setWorkDate(e.target.value)}
                className="input text-gray-700"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Khung giờ khám</label>
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <input
                  type="time"
                  value={slot}
                  onChange={e => handleSlotChange(index, e.target.value)}
                  className="input text-gray-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(index)}
                  className="text-red-600 text-sm"
                >
                  Xóa
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSlot}
              className="mt-2 text-blue-600 text-sm"
            >
              + Thêm khung giờ
            </button>
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
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};