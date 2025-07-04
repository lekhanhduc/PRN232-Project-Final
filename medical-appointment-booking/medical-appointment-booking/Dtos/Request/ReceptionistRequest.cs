using medical_appointment_booking.Common;

namespace medical_appointment_booking.Dtos.Request
{
    public class ReceptionistRequest
    {
        public string? Email { get; set; }

        public string? Phone { get; set; }

        public UserStatus UserStatus { get; set; }

    }
}
