using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using medical_appointment_booking.Common;

namespace medical_appointment_booking.Models
{
    public class Patient: BaseEntity<long>
    {
        [Required]
        [Column("user_id")]
        [ForeignKey("User")]
        public long UserId { get; set; }
        public User User { get; set; }

        [Column("first_name")]
        public string? FirstName { get; set; }

        [Column("last_name")]
        public string? LastName { get; set; }

        [Column("phone")]
        public string? Phone { get; set; }

        [Column("avatar")]
        public string? Avatar { get; set; }

        [Column("dob")]
        public DateOnly Dob { get; set; }

        [Column("gender", TypeName = "nvarchar(20)")]
        public Gender? Gender { get; set; }

        [Column("address")]
        public string? Address { get; set; }

        // Add Appointments
        public virtual ICollection<Appointment>? Appointments { get; set; }
    }
}
