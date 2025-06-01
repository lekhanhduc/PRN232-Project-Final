using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace medical_appointment_booking.Models
{
    public class Specialty : BaseEntity<int>
    {
        [Required]
        [Column("specialty_name")]
        [StringLength(100)]
        public string SpecialtyName { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Required]
        [Column("is_active")]
        public bool IsActive { get; set; } = true;
    }
}