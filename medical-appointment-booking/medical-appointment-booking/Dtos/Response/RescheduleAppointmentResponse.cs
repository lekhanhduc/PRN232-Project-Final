namespace medical_appointment_booking.Dtos.Response
{
    public class RescheduleAppointmentResponse
    {
        public long AppointmentId { get; set; }
        public string NewAppointmentDate { get; set; }
        public string NewAppointmentTime { get; set; }
    }
}
