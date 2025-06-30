namespace medical_appointment_booking.Dtos.Response
{
    public class CreateAppointmentResponse
    {
        public long AppointmentId { get; set; }
        public string AppointmentNumber { get; set; }
        public DoctorInfoDto Doctor { get; set; }
        public string AppointmentDate { get; set; }
        public string AppointmentTime { get; set; }
        public decimal TotalFee { get; set; }
        public string Status { get; set; }
    }

    public class DoctorInfoDto
    {
        public string FullName { get; set; }
        public string Specialty { get; set; }
    }
}
    [Route("api/v1/appointments")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService appointmentService;
        private readonly IHttpContextAccessor httpContextAccessor;

        public AppointmentController(IAppointmentService appointmentService, IHttpContextAccessor httpContextAccessor)
        {
            this.appointmentService = appointmentService;
            this.httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("create")]
        public async Task<ApiResponse<CreateAppointmentResponse>> CreateAppointment([FromBody] CreateAppointmentRequest request)
        {
            var currentUserId = GetCurrentUserId();
            return new ApiResponse<CreateAppointmentResponse>
            {
                code = 201,
                result = await appointmentService.CreateAppointmentAsync(request, currentUserId)
            };
        }


       public async Task<CreateAppointmentResponse> CreateAppointmentAsync(CreateAppointmentRequest request, int currentUserId)
       {
           _logger.LogInformation("Starting appointment creation process for user {UserId} with doctor {DoctorId} on {AppointmentDate}",
               currentUserId, request.DoctorId, request.AppointmentDate);

           using var transaction = await _context.Database.BeginTransactionAsync();
           _logger.LogDebug("Database transaction started for appointment creation");

           try
           {
               // 1. Validate input
               _logger.LogDebug("Validating appointment request for user {UserId}", currentUserId);
               await ValidateAppointmentRequest(request, currentUserId);
               _logger.LogDebug("Appointment request validation completed successfully");

               // 2. Get patient from current user
               var patient = await _context.Patients
                   .FirstOrDefaultAsync(p => p.UserId == currentUserId);

               if (patient == null)
               {
                   _logger.LogWarning("Patient not found for user {UserId}", currentUserId);
                   throw new AppException(ErrorCode.PATIENT_NOT_FOUND);
               }

               _logger.LogDebug("Found patient {PatientId} for user {UserId}", patient.Id, currentUserId);

               // 3. Get doctor information with specialty
               var doctor = await _context.Doctors
                   .Include(d => d.User)
                   .Include(d => d.Specialty)
                   .FirstOrDefaultAsync(d => d.Id == request.DoctorId);

               if (doctor == null || !doctor.IsAvailable)
               {
                   _logger.LogWarning("Doctor {DoctorId} not found or not available", request.DoctorId);
                   throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
               }

               _logger.LogDebug("Found available doctor {DoctorId}: Dr. {DoctorName}, Specialty: {Specialty}",
                   doctor.Id, $"{doctor.FirstName} {doctor.LastName}", doctor.Specialty?.SpecialtyName);

               // 4. Get time slot information with schedule
               var timeSlot = await _context.TimeSlots
                   .Include(ts => ts.WorkSchedule)
                   .FirstOrDefaultAsync(ts => ts.Id == request.SlotId);

               if (timeSlot == null || !timeSlot.IsAvailable)
               {
                   _logger.LogWarning("TimeSlot {SlotId} not found or not available", request.SlotId);
                   throw new AppException(ErrorCode.TIMESLOT_NOT_AVAILABLE);
               }

               _logger.LogDebug("Found available time slot {SlotId} at {SlotTime}", request.SlotId, timeSlot.SlotTime);

               // 5. Get service package for fee calculation
               var servicePackage = await _context.ServicePackages
                   .FirstOrDefaultAsync(sp => sp.Id == request.PackageId);

               if (servicePackage == null || !servicePackage.IsActive)
               {
                   _logger.LogWarning("Service package {PackageId} not found or inactive", request.PackageId);
                   throw new AppException(ErrorCode.SERVICE_PACKAGE_NOT_FOUND);
               }

               _logger.LogDebug("Found service package {PackageId} with fee {PackageFee}",
                   servicePackage.Id, servicePackage.Fee);

               // 6. Parse appointment date
               if (!DateOnly.TryParse(request.AppointmentDate, out var appointmentDate))
               {
                   _logger.LogWarning("Invalid appointment date format: {AppointmentDate}", request.AppointmentDate);
                   throw new AppException(ErrorCode.INVALID_APPOINTMENT_DATE);
               }

               // 7. Validate that the slot belongs to the requested doctor and date
               if (timeSlot.WorkSchedule.DoctorId != request.DoctorId ||
                   timeSlot.WorkSchedule.WorkDate != appointmentDate)
               {
                   _logger.LogWarning("TimeSlot {SlotId} does not belong to doctor {DoctorId} or date {AppointmentDate}. " +
                       "Actual: Doctor {ActualDoctorId}, Date {ActualDate}",
                       request.SlotId, request.DoctorId, appointmentDate,
                       timeSlot.WorkSchedule.DoctorId, timeSlot.WorkSchedule.WorkDate);
                   throw new AppException(ErrorCode.TIMESLOT_DOCTOR_MISMATCH);
               }

               // 8. Calculate fees
               var consultationFee = doctor.ConsultationFee;
               var packageFee = servicePackage.Fee;
               var totalFee = consultationFee + packageFee;

               _logger.LogInformation("Fee calculation - Consultation: {ConsultationFee}, Package: {PackageFee}, Total: {TotalFee}",
                   consultationFee, packageFee, totalFee);

               // 9. Create appointment entity
               var appointment = new Appointment
               {
                   PatientId = patient.Id,
                   DoctorId = request.DoctorId,
                   SlotId = request.SlotId,
                   AppointmentDate = appointmentDate,
                   AppointmentTime = timeSlot.SlotTime,
                   Status = "scheduled",
                   ReasonForVisit = request.ReasonForVisit,
                   ConsultationFee = consultationFee,
                   TotalFee = totalFee,
                   ServicePackageId = request.PackageId,
                   CreatedBy = currentUserId,
                   CreatedAt = DateTime.Now,
                   UpdatedAt = DateTime.Now,
               };

               // 10. Save appointment
               _context.Appointments.Add(appointment);
               await _context.SaveChangesAsync();

               _logger.LogInformation("Appointment {AppointmentId} created successfully for patient {PatientId}",
                   appointment.Id, patient.Id);

               // 11. Update time slot availability
               timeSlot.IsAvailable = false;
               await _context.SaveChangesAsync();

               _logger.LogDebug("TimeSlot {SlotId} marked as unavailable", request.SlotId);

               // 12. Generate appointment number
               var appointmentNumber = GenerateAppointmentNumber(appointmentDate, appointment.Id);
               _logger.LogDebug("Generated appointment number: {AppointmentNumber}", appointmentNumber);

               // 13. Commit transaction
               await transaction.CommitAsync();
               _logger.LogInformation("Transaction committed successfully for appointment {AppointmentId}", appointment.Id);

               // 14. Create response
               var response = new CreateAppointmentResponse
               {
                   AppointmentId = appointment.Id,
                   AppointmentNumber = appointmentNumber,
                   Doctor = new DoctorInfoDto
                   {
                       FullName = $"Dr. {doctor.FirstName} {doctor.LastName}".Trim(),
                       Specialty = doctor.Specialty?.SpecialtyName ?? "N/A"
                   },
                   AppointmentDate = appointmentDate.ToString("yyyy-MM-dd"),
                   AppointmentTime = timeSlot.SlotTime.ToString(@"hh\:mm"),
                   TotalFee = totalFee,
                   Status = "scheduled"
               };

               _logger.LogInformation("Appointment creation completed successfully. AppointmentId: {AppointmentId}, Number: {AppointmentNumber}",
                   appointment.Id, appointmentNumber);

               return response;
           }
           catch (AppException ex)
           {
               _logger.LogWarning("Business logic error during appointment creation for user {UserId}: {ErrorCode} - {ErrorMessage}",
                   currentUserId, ex.ErrorCode.Code, ex.ErrorCode.Message);
               await transaction.RollbackAsync();
               throw;
           }
           catch (Exception ex)
           {
               _logger.LogError(ex, "Unexpected error during appointment creation for user {UserId} with doctor {DoctorId}",
                   currentUserId, request.DoctorId);
               await transaction.RollbackAsync();
               throw;
           }
       }

        private async Task ValidateAppointmentRequest(CreateAppointmentRequest request, int currentUserId)
 {
     _logger.LogDebug("Starting validation for appointment request - User: {UserId}, Doctor: {DoctorId}, Date: {AppointmentDate}",
         currentUserId, request.DoctorId, request.AppointmentDate);

     // Validate appointment date
     if (!DateOnly.TryParse(request.AppointmentDate, out var appointmentDate))
     {
         _logger.LogWarning("Invalid appointment date format: {AppointmentDate}", request.AppointmentDate);
         throw new AppException(ErrorCode.INVALID_APPOINTMENT_DATE);
     }

     if (appointmentDate < DateOnly.FromDateTime(DateTime.Now))
     {
         _logger.LogWarning("Attempt to create appointment in the past: {AppointmentDate}", appointmentDate);
         throw new AppException(ErrorCode.PAST_APPOINTMENT_DATE);
     }

     // Check if doctor exists and is available
     var doctor = await _context.Doctors
         .FirstOrDefaultAsync(d => d.Id == request.DoctorId);

     if (doctor == null || !doctor.IsAvailable)
     {
         _logger.LogWarning("Doctor validation failed - DoctorId: {DoctorId}, Found: {Found}, Available: {Available}",
             request.DoctorId, doctor != null, doctor?.IsAvailable);
         throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
     }

     // Check if time slot exists and is available
     var timeSlot = await _context.TimeSlots
         .Include(ts => ts.WorkSchedule)
         .FirstOrDefaultAsync(ts => ts.Id == request.SlotId);

     if (timeSlot == null || !timeSlot.IsAvailable)
     {
         _logger.LogWarning("TimeSlot validation failed - SlotId: {SlotId}, Found: {Found}, Available: {Available}",
             request.SlotId, timeSlot != null, timeSlot?.IsAvailable);
         throw new AppException(ErrorCode.TIMESLOT_NOT_AVAILABLE);
     }

     // Validate that the slot belongs to the requested doctor and date
     if (timeSlot.WorkSchedule.DoctorId != request.DoctorId ||
         timeSlot.WorkSchedule.WorkDate != appointmentDate)
     {
         _logger.LogWarning("TimeSlot-Doctor mismatch - Expected: Doctor {ExpectedDoctorId}, Date {ExpectedDate}; " +
             "Actual: Doctor {ActualDoctorId}, Date {ActualDate}",
             request.DoctorId, appointmentDate,
             timeSlot.WorkSchedule.DoctorId, timeSlot.WorkSchedule.WorkDate);
         throw new AppException(ErrorCode.TIMESLOT_DOCTOR_MISMATCH);
     }

     // Check if service package exists
     var servicePackage = await _context.ServicePackages
         .FirstOrDefaultAsync(sp => sp.Id == request.PackageId);

     if (servicePackage == null || !servicePackage.IsActive)
     {
         _logger.LogWarning("Service package validation failed - PackageId: {PackageId}, Found: {Found}, Active: {Active}",
             request.PackageId, servicePackage != null, servicePackage?.IsActive);
         throw new AppException(ErrorCode.SERVICE_PACKAGE_NOT_FOUND);
     }

     // Check if patient already has appointment at this time
     var patient = await _context.Patients
         .FirstOrDefaultAsync(p => p.UserId == currentUserId);

     if (patient == null)
     {
         _logger.LogWarning("Patient not found for user {UserId} during validation", currentUserId);
         throw new AppException(ErrorCode.PATIENT_NOT_FOUND);
     }

     var existingAppointment = await _context.Appointments
         .FirstOrDefaultAsync(a =>
             a.PatientId == patient.Id &&
             a.AppointmentDate == appointmentDate &&
             a.AppointmentTime == timeSlot.SlotTime &&
             a.Status != "cancelled");

     if (existingAppointment != null)
     {
         _logger.LogWarning("Appointment conflict detected for patient {PatientId} on {AppointmentDate} at {AppointmentTime}. " +
             "Existing appointment: {ExistingAppointmentId}",
             patient.Id, appointmentDate, timeSlot.SlotTime, existingAppointment.Id);
         throw new AppException(ErrorCode.APPOINTMENT_CONFLICT);
     }

     _logger.LogDebug("Appointment request validation completed successfully");
 }

 private static string GenerateAppointmentNumber(DateOnly appointmentDate, long appointmentId)
 {
     // Format: AP + YYYYMMDD + 4-digit sequential number
     return $"AP{appointmentDate:yyyyMMdd}{appointmentId:D4}";
 }
