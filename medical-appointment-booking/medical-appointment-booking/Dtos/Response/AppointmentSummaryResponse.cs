namespace medical_appointment_booking.Dtos.Response
{
    public class AppointmentSummaryResponse
    {
        public long AppointmentId { get; set; }
        public PatientInfoResponse Patient { get; set; } = default!;
    }
}
