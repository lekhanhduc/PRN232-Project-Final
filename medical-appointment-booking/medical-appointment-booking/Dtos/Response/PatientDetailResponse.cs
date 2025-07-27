using medical_appointment_booking.Common;

namespace medical_appointment_booking.Dtos.Response
{
    public class PatientDetailResponse
    {
        public string? FirstName { get; set; }

        public string Email { get; set; } = string.Empty;

        public string? LastName { get; set; }

        public bool? Enable2FA { get; set; }
        public string? Phone { get; set; }

        public string? Avatar { get; set; }

        public DateOnly Dob { get; set; }

        public Gender? Gender { get; set; }

        public string? Address { get; set; }

        public string? UserType { get; set; }
    }
}
