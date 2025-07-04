namespace medical_appointment_booking.Dtos.Response
{
    public class AppointmentResponse
    {
        public long AppointmentId { get; set; }
        public DateOnly AppointmentDate { get; set; }
        public string Status { get; set; } = string.Empty;

        
    }
}
