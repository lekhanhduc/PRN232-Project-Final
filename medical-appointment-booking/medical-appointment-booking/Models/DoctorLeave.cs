using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace medical_appointment_booking.Models
{
    public class DoctorLeave
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("doctor_id")]
        [ForeignKey("Doctor")]
        public long DoctorId { get; set; }
        public Doctor? Doctor { get; set; }

        [Required]
        [Column("leave_date")]
        public DateOnly LeaveDate { get; set; }

        [Column("reason")]
        public string? Reason { get; set; }
    }
}