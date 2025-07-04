namespace medical_appointment_booking.Dtos.Response
{
    public class PatientDto
    {
        public long Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
        public List<AppointmentForReceptionistResponse> RecentAppointments { get; set; } = new();
    }
}
