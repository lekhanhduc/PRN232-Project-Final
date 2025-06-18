using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using medical_appointment_booking.Common;

namespace medical_appointment_booking.Models
{
    public class User : BaseEntity<long>
    {
        [EmailAddress]
        [Column("email")]
        public string? Email { get; set; }


        [Column("phone")]
        public string? Phone { get; set; }


        [Column("password")]
        public string? Password { get; set; }


        [Column("user_status", TypeName = "nvarchar(20)")]
        public UserStatus UserStatus { get; set; } = UserStatus.ACTIVE;

        [Column("two_factor_secret")]
        public string? TwoFactorSecret { get; set; }

        [Column("is_2fa_verified")]
        public bool Enable2FA { get; set; } = false;


        [Required]
        [ForeignKey("Role")]
        [Column("role_id")]
        public int RoleId { get; set; }
        public Role? Role { get; set; }
    }
}
