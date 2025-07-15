namespace medical_appointment_booking.Dtos.Excel
{
    public class WorkScheduleSlotRow
    {
        public long DoctorId { get; set; }
        public DateOnly WorkDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public int MaxPatients { get; set; }
        public bool IsAvailable { get; set; }
        public TimeOnly SlotTime { get; set; }
    }

}
