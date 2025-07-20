using medical_appointment_booking.Dtos.Excel;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;
using OfficeOpenXml;
using System.ComponentModel;
using System.Threading.Tasks;

namespace medical_appointment_booking.Services.Impl
{
    public class ExcelService : IExcelService
    {
        private readonly ScheduleRepository scheduleRepository;

        public ExcelService(ScheduleRepository scheduleRepository)
        {
            this.scheduleRepository = scheduleRepository;
        }

        public async Task<ExcelImportResult> ImportSchedulesWithSlotsFromExcel(Stream fileStream)
        {
            OfficeOpenXml.ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;
            var result = new ExcelImportResult();
            var slotRows = new List<WorkScheduleSlotRow>();

            using var package = new ExcelPackage(fileStream);
            var worksheet = package.Workbook.Worksheets[0];
            int rowCount = worksheet.Dimension.Rows;
            int colCount = worksheet.Dimension.Columns;

         
            var columnMap = new Dictionary<string, int>();
            for (int col = 1; col <= colCount; col++)
            {
                string header = worksheet.Cells[1, col].Text.Trim();
                if (!string.IsNullOrWhiteSpace(header))
                    columnMap[header] = col;
            }

      
            for (int row = 2; row <= rowCount; row++)
            {
                var dto = new WorkScheduleSlotRowText
                {
                    DoctorIdText = worksheet.Cells[row, columnMap["DoctorId"]].Text,
                    WorkDateText = worksheet.Cells[row, columnMap["WorkDate"]].Text,
                    StartTimeText = worksheet.Cells[row, columnMap["StartTime"]].Text,
                    EndTimeText = worksheet.Cells[row, columnMap["EndTime"]].Text,
                    MaxPatientsText = worksheet.Cells[row, columnMap["MaxPatients"]].Text,
                    IsAvailableText = worksheet.Cells[row, columnMap["IsAvailable"]].Text,
                    SlotTimeText = worksheet.Cells[row, columnMap["SlotTime"]].Text
                };

                if (dto.IsValid(out var errors, out var parsed))
                {
                    slotRows.Add(parsed);
                }
                else
                {
                    result.Errors.Add($"Row: {row}: {string.Join("; ", errors)}");
                }
            }
       
            var schedules = new List<WorkSchedule>();
            var grouped = slotRows.GroupBy(s => new
            {
                s.DoctorId,
                s.WorkDate,
                s.StartTime,
                s.EndTime,
                s.MaxPatients,
                s.IsAvailable
            });

            foreach (var group in grouped)
            {
                var schedule = new WorkSchedule
                {
                    DoctorId = group.Key.DoctorId,
                    WorkDate = group.Key.WorkDate,
                    StartTime = group.Key.StartTime,
                    EndTime = group.Key.EndTime,
                    MaxPatients = group.Key.MaxPatients,
                    IsAvailable = group.Key.IsAvailable,
                    TimeSlots = group
                    .GroupBy(s => s.SlotTime) 
                    .Select(g => new TimeSlot
                    {
                        SlotTime = g.Key,
                        IsAvailable = true
                    })
                    .OrderBy(ts => ts.SlotTime)
                    .ToList()

                };

                schedules.Add(schedule);
            }

            if (schedules.Count > 0)
            {
                await scheduleRepository.CreateListScheduleAsync(schedules);
            }

            return result;
        }
    }
}
