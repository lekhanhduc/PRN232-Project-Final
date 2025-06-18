using medical_appointment_booking.Common;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace medical_appointment_booking.Dtos.Request
{
    public class DoctorUpdateRequest
    {
        public int? SpecialtyId { get; set; }

        [StringLength(50, ErrorMessage = "License number cannot exceed 50 characters")]
        public string? LicenseNumber { get; set; }

        [StringLength(100, ErrorMessage = "Degree cannot exceed 100 characters")]
        public string? Degree { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Consultation fee must be greater than or equal to 0")]
        public decimal? ConsultationFee { get; set; }

        public bool? IsAvailable { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Gender? Gender { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Years of experience must be greater than or equal to 0")]
        public int? YearsOfExperience { get; set; }

        public string? Bio { get; set; }
    }

}
