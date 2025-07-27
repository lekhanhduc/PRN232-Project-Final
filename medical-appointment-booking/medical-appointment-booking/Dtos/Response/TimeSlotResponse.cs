namespace medical_appointment_booking.Dtos.Response
{
    public class TimeSlotResponse
    {
        public int SlotId { get; set; }
        public TimeOnly SlotTime { get; set; }
        public bool IsAvailable { get; set; }
        public AppointmentSummaryResponse? Appointment { get; set; }
    }
}
