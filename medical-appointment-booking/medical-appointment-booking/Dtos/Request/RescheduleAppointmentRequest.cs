namespace medical_appointment_booking.Dtos.Request
{
    public class RescheduleAppointmentRequest
    {
        public int NewSlotId { get; set; }
        public string NewAppointmentDate { get; set; }
        public string Reason { get; set; }
    }
}
