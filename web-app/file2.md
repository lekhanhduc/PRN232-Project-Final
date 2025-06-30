namespace medical_appointment_booking.Dtos.Response
{
    public class DoctorWorkingScheduleResponse
    {
        public long DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public List<WorkingDayResponse> AvailableDays { get; set; } = new();
    }

    public class WorkingDayResponse
    {
        public DateOnly Date { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
        public List<WorkingTimeSlotResponse> AvailableSlots { get; set; } = new();
    }

    public class WorkingTimeSlotResponse
    {
        public long SlotId { get; set; }
        public TimeOnly SlotTime { get; set; }
        public string SlotTimeFormatted { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
    }
}


[HttpGet("{doctorId}/working-schedule")]
public async Task<ApiResponse<DoctorWorkingScheduleResponse>> GetDoctorSchedule(
                long doctorId,
                [FromQuery] int daysAhead = 14)
{
    var schedule = await doctorService.GetDoctorWorkingScheduleAsync(doctorId, daysAhead);
    return new ApiResponse<DoctorWorkingScheduleResponse>
    {
        code = 200,
        result = schedule
    };
}
public async Task<DoctorWorkingScheduleResponse> GetDoctorWorkingScheduleAsync(long doctorId, int daysAhead = 14)
{
    if (doctorId <= 0)
        throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);

    if (daysAhead <= 0 || daysAhead > 365)
        throw new AppException(ErrorCode.INVALID_DAYS_AHEAD_RANGE);

    // Get doctor info
    var doctor = await doctorRepository.GetDoctorByIdAsync(doctorId);
    if (doctor == null)
        throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);

    var startDate = DateOnly.FromDateTime(DateTime.Today);
    var endDate = startDate.AddDays(daysAhead);

    var workSchedulesTask = await doctorRepository.GetWorkSchedulesAsync(doctorId, startDate, endDate);
    var leaveDatesTask = await doctorRepository.GetDoctorLeaveDatesAsync(doctorId, startDate, endDate);
    var bookedSlotsTask = await doctorRepository.GetBookedSlotsAsync(doctorId, startDate, endDate);


    var response = new DoctorWorkingScheduleResponse
    {
        DoctorId = doctor.Id,
        DoctorName = $"{doctor.FirstName} {doctor.LastName}",
        AvailableDays = new List<WorkingDayResponse>()
    };

    var workSchedules = workSchedulesTask;
    var leaveDates = leaveDatesTask.ToHashSet(); // Use HashSet for O(1) lookup
    var bookedSlots = bookedSlotsTask.ToHashSet(); // Use HashSet for O(1) lookup

    return BuildWorkingScheduleResponse(doctor, workSchedules, leaveDates, bookedSlots);
}

private DoctorWorkingScheduleResponse BuildWorkingScheduleResponse(
                    Doctor doctor,
                    List<WorkSchedule> workSchedules,
                    HashSet<DateOnly> leaveDates,
                    HashSet<(DateOnly AppointmentDate, long SlotId)> bookedSlots)
{
    var response = new DoctorWorkingScheduleResponse
    {
        DoctorId = doctor.Id,
        DoctorName = $"{doctor.FirstName} {doctor.LastName}",
        AvailableDays = new List<WorkingDayResponse>()
    };

    foreach (var schedule in workSchedules)
    {
        // Skip if doctor is on leave
        var workDateOnly = schedule.WorkDate;
        if (leaveDates.Contains(workDateOnly))
            continue;

        var availableSlots = BuildAvailableSlots(schedule, workDateOnly, bookedSlots);

        // Only add days that have at least one available slot
        if (availableSlots.Any(s => s.IsAvailable))
        {
            response.AvailableDays.Add(new WorkingDayResponse
            {
                Date = workDateOnly,
                DayOfWeek = schedule.WorkDate.ToString("dddd"),
                AvailableSlots = availableSlots
            });
        }
    }

    return response;
}

        private List<WorkingTimeSlotResponse> BuildAvailableSlots(
                            WorkSchedule schedule,
                            DateOnly workDate,
                            HashSet<(DateOnly AppointmentDate, long SlotId)> bookedSlots)
        {
            var availableSlots = new List<WorkingTimeSlotResponse>();

            foreach (var slot in schedule.TimeSlots.Where(ts => ts.IsAvailable))
            {
                var isBooked = bookedSlots.Contains((workDate, slot.Id));

                availableSlots.Add(new WorkingTimeSlotResponse
                {
                    SlotId = slot.Id,
                    SlotTime = slot.SlotTime,
                    SlotTimeFormatted = slot.SlotTime.ToString(@"HH\:mm"),
                    IsAvailable = !isBooked
                });
            }

            return availableSlots;
        }