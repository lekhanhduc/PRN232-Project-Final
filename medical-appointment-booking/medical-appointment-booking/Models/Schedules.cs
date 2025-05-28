using System.ComponentModel.DataAnnotations.Schema;

namespace medical_appointment_booking.Models
{
    public class Schedules : BaseEntity<int>
    {
        [Column("user_id")]
        public int UserId { get; set; } // Bác sĩ (liên kết với Users)

        [Column("clinic_id")]
        public int ClinicId { get; set; } // Phòng khám (liên kết với Clinics)

        [Column("day_of_week")]
        public string DayOfWeek { get; set; } // Ngày trong tuần (Monday, Tuesday,...)

        [Column("start_time")]
        public TimeSpan StartTime { get; set; } // Giờ bắt đầu

        [Column("end_time")]
        public TimeSpan EndTime { get; set; } // Giờ kết thúc

        [Column("is_available")]
        public bool IsAvailable { get; set; } // Có sẵn để đặt lịch hay không
    }
}
