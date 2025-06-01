using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using medical_appointment_booking.Common;

namespace medical_appointment_booking.Models
{
    public class AppointmentHistory : BaseEntity<int>
    {
        [Required]
        [Column("appointment_id")]
        [ForeignKey("Appointment")]
        public long AppointmentId { get; set; }

        [Column("old_doctor_id")]
        public long? OldDoctorId { get; set; }

        [Column("old_slot_id")]
        public int? OldSlotId { get; set; }


        [Column("old_appointment_date", TypeName = "date")]
        public DateTime? OldAppointmentDate { get; set; }


        [Column("old_appointment_time", TypeName = "time")]
        public TimeSpan? OldAppointmentTime { get; set; }

        [Required]
        [Column("action_type", TypeName = "nvarchar(20)")]
        public ActionType? ActionType { get; set; }

        [Column("changed_by")]
        [ForeignKey("ChangedByUser")]
        public long? ChangedBy { get; set; }

        public virtual Appointment? Appointment { get; set; }
        public virtual User? ChangedByUser { get; set; }
    }
}
