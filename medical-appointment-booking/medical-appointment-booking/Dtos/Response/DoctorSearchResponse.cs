using medical_appointment_booking.Common;

namespace medical_appointment_booking.Dtos.Response
{
    public class DoctorSearchResponse
    {
        public long DoctorId { get; set; }
        public string FullName { get; set; }
        public string AcademicTitle { get; set; }
        public SpecialtyDto Specialty { get; set; }
        public Gender? Gender { get; set; }
        public int YearsOfExperience { get; set; }
        public decimal ConsultationFee { get; set; }
        public string Bio { get; set; }
        public List<WorkScheduleDto> WorkSchedules { get; set; }
    }

    public class WorkScheduleDto
    {
        public long ScheduleId { get; set; }
        public string WorkDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public List<TimeSlotDto> TimeSlots { get; set; }
    }

    public class TimeSlotDto
    {
        public long SlotId { get; set; }
        public string SlotTime { get; set; }
        public bool IsAvailable { get; set; }
    }
}
