using medical_appointment_booking.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace medical_appointment_booking.Dtos.Response
{
    public class AppointmentCreationResponse
    {
        public long AppointmentId { get; set; }
        public long DoctorId { get; set; }
        public DoctorDto? Doctor { get; set; }

        public DateOnly AppointmentDate { get; set; }

        public TimeOnly AppointmentTime { get; set; }

        public string Status { get; set; } = "scheduled";

        public decimal TotalFee { get; set; }

    }
    public class DoctorDto
    {
        public string FullName { get; set; }
        public string SpecialtyName { get; set; }
    }
}
