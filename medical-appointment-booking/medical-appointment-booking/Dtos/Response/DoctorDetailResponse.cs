using medical_appointment_booking.Common;
using System.Text.Json.Serialization;

namespace medical_appointment_booking.Dtos.Response
{
    public class DoctorDetailResponse
    {
        public long DoctorId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;
        public SpecialtyDto Specialty { get; set; }
        public string LicenseNumber { get; set; }
        public string Degree { get; set; }
        public int YearsOfExperience { get; set; }
        public decimal ConsultationFee { get; set; }
        public string Bio { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Gender? Gender { get; set; }
        public bool IsAvailable { get; set; }
    }

    public class SpecialtyDto
    {
        public long SpecialtyId { get; set; }
        public string SpecialtyName { get; set; }
        public string Description { get; set; }
        public Gender? Gender { get; set; }
        public int YearsOfExperience { get; set; }
        public string? Bio { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? Avatar { get; set; }
    }
}
