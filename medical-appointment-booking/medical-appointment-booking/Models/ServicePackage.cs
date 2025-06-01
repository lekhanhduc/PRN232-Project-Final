using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace medical_appointment_booking.Models
{
    public class ServicePackage : BaseEntity<int>
    {
        [Required]
        [Column("package_name")]
        [StringLength(100)]
        public string? PackageName { get; set; }

        [Column("description", TypeName = "ntext")]
        public string? Description { get; set; }

        [Required]
        [Column("fee", TypeName = "decimal(10,2)")]
        public decimal Fee { get; set; }

        [Column("duration_minutes")]
        public int? DurationMinutes { get; set; } // Thời gian khám dự kiến

        [Required]
        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        //public virtual ICollection<DoctorService>? DoctorServices { get; set; }
        public virtual ICollection<Appointment>? Appointments { get; set; }
    }
}
