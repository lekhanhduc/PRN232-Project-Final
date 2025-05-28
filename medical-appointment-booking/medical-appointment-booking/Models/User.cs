using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using medical_appointment_booking.Common;

namespace medical_appointment_booking.Models
{
    public class User : BaseEntity<long>
    {
        [Required, EmailAddress]
        [Column("email")]
        public string? Email { get; set; }

        [Column("phone")]
        public string? Phone { get; set; }

        [Column("password")]
        public string? Password { get; set; }

        [Required]
        [Column("name")]
        public string? Name { get; set; }

        [Required]
        [Column("first_name")]
        public string? FirstName { get; set; }

        [Required]
        [Column("last_name")]
        public string? LastName { get; set; }


        [Column("gender", TypeName = "nvarchar(50)")]
        public Gender? Gender { get; set; }


        [Column("address")]
        public string? Address { get; set; }

        [Column("refresh_token")]
        public string? RefreshToken { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("dob")]
        public DateOnly Dob { get; set; }

        [Column("enabled")]
        public bool Enabled { get; set; } = true;

        [Required]
        [ForeignKey("Role")]
        [Column("role_id")]
        public int RoleId { get; set; }
        public Role Role { get; set; }
    }
}
