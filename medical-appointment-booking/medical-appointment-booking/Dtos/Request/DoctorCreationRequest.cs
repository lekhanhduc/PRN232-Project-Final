using medical_appointment_booking.Common;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace medical_appointment_booking.Dtos.Request
{
    public class DoctorCreationRequest
    {
        // Thông tin User
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone is required")]
        [StringLength(20, ErrorMessage = "Phone cannot exceed 20 characters")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "FirstName is required")]
        [StringLength(100, ErrorMessage = "FirstName cannot exceed 100 characters")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "LastName is required")]
        [StringLength(100, ErrorMessage = "LastName cannot exceed 100 characters")]
        public string LastName { get; set; } = string.Empty;

        public int SpecialtyId { get; set; }


        [Required(ErrorMessage = "License number is required")]
        [StringLength(50, ErrorMessage = "License number cannot exceed 50 characters")]
        public string LicenseNumber { get; set; } = string.Empty;


        [StringLength(100, ErrorMessage = "Degree cannot exceed 100 characters")]
        public string? Degree { get; set; }


        [Range(0, double.MaxValue, ErrorMessage = "Consultation fee must be greater than or equal to 0")]
        public decimal ConsultationFee { get; set; }


        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Gender? Gender { get; set; }


        [Range(0, int.MaxValue, ErrorMessage = "Years of experience must be greater than or equal to 0")]
        public int YearsOfExperience { get; set; }

        public string? Bio { get; set; }

        public string? Avatar { get; set; }
    }

}
