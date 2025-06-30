namespace medical_appointment_booking.Dtos.Response
{
    public class DoctorAppointmentScheduleResponse
    {
        public long DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public List<AppointmentDayResponse> WorkSchedules { get; set; } = new();
    }

    public class AppointmentDayResponse
    {
        public int ScheduleId { get; set; }
        public DateTime WorkDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public int MaxPatients { get; set; }
        public bool IsAvailable { get; set; }
        public List<AppointmentTimeSlotResponse> AvailableSlots { get; set; } = new();
    }

    public class AppointmentTimeSlotResponse
    {
        public long SlotId { get; set; }
        public TimeOnly SlotTime { get; set; }
        public string SlotTimeFormatted { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public bool IsBooked { get; set; }
    }

}
