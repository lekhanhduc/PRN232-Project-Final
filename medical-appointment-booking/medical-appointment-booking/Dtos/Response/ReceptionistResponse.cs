using medical_appointment_booking.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace medical_appointment_booking.Dtos.Response
{
    public class ReceptionistResponse
    {

        public long Id { get; set; }
        public string? Email { get; set; }

        public string? Phone { get; set; }

        public UserStatus UserStatus { get; set; } 
        public DateTime CreatedAt { get; set; }

        public List<AppointmentResponse> RecentAppointments { get; set; } = new();
    }
}
