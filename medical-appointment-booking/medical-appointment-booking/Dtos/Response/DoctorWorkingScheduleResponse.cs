namespace medical_appointment_booking.Dtos.Response
{
    public class DoctorWorkingScheduleResponse
    {
        public long DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public List<WorkingDayResponse> AvailableDays { get; set; } = new();
    }

    public class WorkingDayResponse
    {
        public DateOnly Date { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
        public List<WorkingTimeSlotResponse> AvailableSlots { get; set; } = new();
    }

    public class WorkingTimeSlotResponse
    {
        public long SlotId { get; set; }
        public TimeOnly SlotTime { get; set; }
        public string SlotTimeFormatted { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
    }
}
