using medical_appointment_booking.Dtos.Response;

namespace medical_appointment_booking.Services
{
    public interface IExcelService
    {
        Task<ExcelImportResult> ImportSchedulesWithSlotsFromExcel(Stream fileStream);
    }
}
