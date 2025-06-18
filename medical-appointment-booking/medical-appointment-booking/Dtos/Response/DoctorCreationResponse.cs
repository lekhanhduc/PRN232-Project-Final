using medical_appointment_booking.Common;

namespace medical_appointment_booking.Dtos.Response
{
    public class DoctorCreationResponse
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public int? SpecialtyId { get; set; }
        public string? SpecialtyName { get; set; }
        public string LicenseNumber { get; set; } = string.Empty;
        public string? Degree { get; set; }
        public decimal ConsultationFee { get; set; }
        public bool IsAvailable { get; set; }
        public Gender? Gender { get; set; }
        public int YearsOfExperience { get; set; }
        public string? Bio { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
