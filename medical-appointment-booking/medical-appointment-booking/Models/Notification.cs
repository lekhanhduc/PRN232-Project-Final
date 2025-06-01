using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using medical_appointment_booking.Common;

namespace medical_appointment_booking.Models
{
    public class Notification: BaseEntity<int>
    {
        [Required]
        [Column("recipient_id ")]
        [ForeignKey("User")]
        public long RecipientId { get; set; }
        public User? User { get; set; }

        public string? Title { get; set; }

        [Column("notification_type", TypeName = "nvarchar(50)")]
        public NotificationType? NotificationType { get; set; }

        [Required]
        [Column("message")]
        public string? Message { get; set; }

        [Required]
        [Column("is_read")]
        public bool IsRead { get; set; } = false;
    }
}
