namespace medical_appointment_booking.Dtos.Excel
{
    public class WorkScheduleSlotRowText
    {
        public string DoctorIdText { get; set; }
        public string WorkDateText { get; set; }
        public string StartTimeText { get; set; }
        public string EndTimeText { get; set; }
        public string MaxPatientsText { get; set; }
        public string IsAvailableText { get; set; }
        public string SlotTimeText { get; set; }

        public bool IsValid(out List<string> errors, out WorkScheduleSlotRow entity)
        {
            errors = new();
            entity = null;

            try
            {
                bool isAvailable = ParseBool(IsAvailableText);

                entity = new WorkScheduleSlotRow
                {
                    DoctorId = long.Parse(DoctorIdText),
                    WorkDate = DateOnly.Parse(WorkDateText),
                    StartTime = TimeOnly.Parse(StartTimeText),
                    EndTime = TimeOnly.Parse(EndTimeText),
                    MaxPatients = int.TryParse(MaxPatientsText, out var max) ? max : 20,
                    IsAvailable = isAvailable,
                    SlotTime = TimeOnly.Parse(SlotTimeText)
                };

                return true;
            }
            catch (Exception ex)
            {
                errors.Add($"Lỗi chuyển đổi dữ liệu: {ex.Message}");
                return false;
            }
        }

        private bool ParseBool(string value)
        {
            if (bool.TryParse(value, out bool result))
                return result;

            // Hỗ trợ kiểu số 1/0
            if (value == "1") return true;
            if (value == "0") return false;

            throw new FormatException($"Giá trị '{value}' không phải bool hợp lệ (true/false hoặc 1/0).");
        }

    }
}
