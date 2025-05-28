using System.ComponentModel.DataAnnotations.Schema;

namespace medical_appointment_booking.Models
{
    public class Clinics : BaseEntity<int>
    {
        [Column("name")]
        public string Name { get; set; } // Tên phòng khám

        [Column("address")]
        public string Address { get; set; } // Địa chỉ

        [Column("phone_number")]
        public string PhoneNumber { get; set; } // Số điện thoại liên hệ

        [Column("email")]
        public string? Email { get; set; } // Email liên hệ (có thể NULL)

        [Column("description")]
        public string? Description { get; set; }
    }
}
