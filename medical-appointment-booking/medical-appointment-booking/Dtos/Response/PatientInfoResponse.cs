namespace medical_appointment_booking.Dtos.Response
{
    public class PatientInfoResponse
    {
        public long PatientId { get; set; }
        public string FullName { get; set; } = default!;
        public string? Phone { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string? Gender { get; set; }
    }
}
