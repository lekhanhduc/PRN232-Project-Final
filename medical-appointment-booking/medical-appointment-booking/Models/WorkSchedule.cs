using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace medical_appointment_booking.Models
{
    public class WorkSchedule : BaseEntity<int>
    {
        [Required]
        [Column("doctor_id")]
        [ForeignKey("Doctor")]
        public long DoctorId { get; set; }
        public Doctor Doctor { get; set; }

        [Required]
        [Column("work_date")]
        public DateOnly WorkDate { get; set; }

        [Required]
        [Column("start_time")]
        public TimeOnly StartTime { get; set; }

        [Required]
        [Column("end_time")]
        public TimeOnly EndTime { get; set; }

        [Column("max_patients")]
        [Range(0, int.MaxValue)]
        public int MaxPatients { get; set; } = 20;

        [Required]
        [Column("is_available")]
        public bool IsAvailable { get; set; } = true;
        public ICollection<TimeSlot>? TimeSlots { get; set; }
    }
}