namespace medical_appointment_booking.Dtos.Response
{
    public class LeaveResponse
    {
        public int Id { get; set; }
        public DateOnly LeaveDate { get; set; }
        public string? Reason { get; set; }
        public long DoctorId { get; set; }
    }
}
