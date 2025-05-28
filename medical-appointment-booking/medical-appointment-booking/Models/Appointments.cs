using System.ComponentModel.DataAnnotations.Schema;

namespace medical_appointment_booking.Models
{
    public class Appointments : BaseEntity<int>
    {
        [Column("patient_user_id")]
        public int PatientUserId { get; set; } // Bệnh nhân (liên kết với Users)

        [Column("doctor_user_id")]
        public int DoctorUserId { get; set; } // Bác sĩ (liên kết với Users)

        [Column("clinic_id")]
        public int ClinicId { get; set; } // Phòng khám (liên kết với Clinics)

        [Column("appointment_date_time")]
        public DateTime AppointmentDateTime { get; set; } // Ngày giờ hẹn

        [Column("reason")]
        public string? Reason { get; set; } // Lý do khám

        [Column("status")]
        public string? Status { get; set; } // Trạng thái (Pending, Confirmed, Completed, Cancelled)
    }
}