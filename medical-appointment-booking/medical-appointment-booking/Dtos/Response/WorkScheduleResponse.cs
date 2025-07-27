namespace medical_appointment_booking.Dtos.Response
{
    public class WorkScheduleResponse
    {
        public int ScheduleId { get; set; }
        public DateOnly WorkDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public int MaxPatients { get; set; }
        public List<TimeSlotResponse> TimeSlots { get; set; } = new();
    }
}
