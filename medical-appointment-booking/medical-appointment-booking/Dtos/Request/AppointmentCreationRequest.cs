using medical_appointment_booking.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace medical_appointment_booking.Dtos.Request
{
    public class AppointmentCreationRequest
    {

        public long PatientId { get; set; }

        public long DoctorId { get; set; }

        public int SlotId { get; set; }

        public DateOnly AppointmentDate { get; set; }

        public TimeOnly AppointmentTime { get; set; }

        public string? ReasonForVisit { get; set; }
        //public int PackageId { get; set; }
        //public string? Notes { get; set; }

    }
}
