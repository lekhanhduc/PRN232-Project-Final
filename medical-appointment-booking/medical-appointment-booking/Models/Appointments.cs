using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace medical_appointment_booking.Models
{
    public class Appointment : BaseEntity<long>
    {
        [Required]
        [Column("patient_id")]
        [ForeignKey("Patient")]
        public long PatientId { get; set; }
        public Patient? Patient { get; set; }

        [Required]
        [Column("doctor_id")]
        [ForeignKey("Doctor")]
        public long DoctorId { get; set; }
        public Doctor? Doctor { get; set; }

        [Required]
        [Column("slot_id")]
        [ForeignKey("TimeSlot")]
        public int SlotId { get; set; }
        public TimeSlot? TimeSlot { get; set; }

        [Required]
        [Column("appointment_date")]
        public DateOnly AppointmentDate { get; set; }

        [Required]
        [Column("appointment_time")]
        public TimeOnly AppointmentTime { get; set; }

        [Column("status")]
        [StringLength(20)]
        public string Status { get; set; } = "scheduled";

        [Column("reason_for_visit")]
        public string? ReasonForVisit { get; set; }

        [Column("consultation_fee", TypeName = "decimal(18,2)")]
        [Range(0, double.MaxValue)]
        public decimal ConsultationFee { get; set; }

        [Column("total_fee", TypeName = "decimal(18,2)")]
        [Range(0, double.MaxValue)]
        public decimal TotalFee { get; set; }

        [Column("created_by")]
        [ForeignKey("CreatedByUser")]
        public long? CreatedBy { get; set; }
        public User? CreatedByUser { get; set; }

        [Column("cancelled_by")]
        [ForeignKey("CancelledByUser")]
        public long? CancelledBy { get; set; }
        public User? CancelledByUser { get; set; }

        [Column("cancel_reason")]
        public string? CancelReason { get; set; }

        [ForeignKey("ServicePackage")]
        public int? ServicePackageId { get; set; }
        public ServicePackage? ServicePackage { get; set; }
    }
}