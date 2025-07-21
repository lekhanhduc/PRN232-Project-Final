// types/doctorSchedule.ts
export type StatusType = 'confirmed' | 'pending' | 'completed' | 'approved' | 'rejected' | 'cancelled';

export interface ScheduleItem {
  id: number;
  patientName: string;
  phone: string;
  time: string;
  department: string;
  symptoms: string;
  status: StatusType;
  duration?: number;
  patientAge?: number;
  priority?: 'low' | 'medium' | 'high';
  isFiltered?: boolean;
}
    