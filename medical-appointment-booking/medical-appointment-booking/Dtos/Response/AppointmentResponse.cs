using System.Text.Json.Serialization;

namespace medical_appointment_booking.Dtos.Response
{
    public class AppointmentResponse
    {
        public long AppointmentId { get; set; }
        public string AppointmentNumber { get; set; }
        public DoctorInfoDto Doctor { get; set; }
        public string AppointmentDate { get; set; }
        public string AppointmentTime { get; set; }
        public string Status { get; set; }
        public decimal TotalFee { get; set; }
        public string ReasonForVisit { get; set; }
        public bool CanCancel { get; set; }
        public bool CanReschedule { get; set; }
    }

    public class AppointmentForReceptionistResponse
    {
        public long AppointmentId { get; set; }  
        public DateOnly AppointmentDate { get; set; }      
        public string Status { get; set; }
     
    }

}
