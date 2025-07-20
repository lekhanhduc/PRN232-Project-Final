namespace medical_appointment_booking.Dtos.Response
{
    public class ExcelImportResult
    {
        public int SuccessCount { get; set; }
        public List<string> Errors { get; set; } = new();
        public int ErrorCount => Errors.Count;
    }
}
