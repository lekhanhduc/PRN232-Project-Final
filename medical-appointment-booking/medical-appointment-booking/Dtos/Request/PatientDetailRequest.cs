using medical_appointment_booking.Common;

namespace medical_appointment_booking.Dtos.Request
{
    public class PatientDetailRequest
    {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Phone { get; set; }

        public DateOnly Dob { get; set; }

        public Gender? Gender { get; set; }

        public string? Address { get; set; }
    }
}
