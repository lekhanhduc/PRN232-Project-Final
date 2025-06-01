using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace medical_appointment_booking.Models
{
    public class TimeSlot : BaseEntity<int>
    {
        [Required]
        [Column("schedule_id")]
        [ForeignKey("WorkSchedule")]
        public int ScheduleId { get; set; }
        public WorkSchedule? WorkSchedule { get; set; }


        [Required]
        [Column("slot_time")]
        public TimeOnly SlotTime { get; set; }

        [Required]
        [Column("is_available")]
        public bool IsAvailable { get; set; } = true;

        public ICollection<Appointment>? Appointments { get; set; }
    }
}