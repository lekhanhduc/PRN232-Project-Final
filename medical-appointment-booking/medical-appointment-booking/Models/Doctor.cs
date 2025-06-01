using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using medical_appointment_booking.Common;

namespace medical_appointment_booking.Models
{
    public class Doctor: BaseEntity<long>
    {
        [Required]
        [Column("user_id")]
        [ForeignKey("User")]
        public long UserId { get; set; }
        public User User { get; set; }

        [Column("specialty_id")]
        [ForeignKey("Specialty")]
        public int? SpecialtyId { get; set; } 
        public Specialty? Specialty { get; set; }

        [Required]
        [Column("license_number")]
        [StringLength(50)]
        public string? LicenseNumber { get; set; }

        [Column("degree")]
        [StringLength(100)]
        public string? Degree { get; set; }

        [Column("consultation_fee", TypeName = "decimal(18,2)")]
        [Range(0, double.MaxValue)]
        public decimal ConsultationFee { get; set; }

        [Required]
        [Column("is_available")]
        public bool IsAvailable { get; set; } = true;


        [Column("gender", TypeName = "nvarchar(20)")]
        public Gender? Gender { get; set; }

        [Column("years_of_experience")]
        [Range(0, int.MaxValue)]
        public int YearsOfExperience { get; set; }

        [Column("bio")]
        public string? Bio { get; set; }

    }
}
