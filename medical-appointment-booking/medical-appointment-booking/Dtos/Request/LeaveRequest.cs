namespace medical_appointment_booking.Dtos.Request
{
    public class LeaveRequest
    {
        public DateOnly LeaveDate { get; set; }
        public string? Reason { get; set; }
    }
}
