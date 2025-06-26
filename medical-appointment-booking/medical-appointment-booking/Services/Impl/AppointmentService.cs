using medical_appointment_booking.Common;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;

namespace medical_appointment_booking.Services.Impl
{
    public class AppointmentService : IAppointmentService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AppointmentService> _logger;

        public AppointmentService(AppDbContext context, ILogger<AppointmentService> logger)
        {
            _context = context;
            _logger = logger;
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

        public async Task<IQueryable<AppointmentResponse>> GetMyAppointmentsAsync(int currentUserId)
        {
            _logger.LogInformation("Retrieving appointments for user {UserId}", currentUserId);

            // Get patient from current user
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserId == currentUserId);

            if (patient == null)
            {
                _logger.LogWarning("Patient not found for user {UserId} when retrieving appointments", currentUserId);
                throw new AppException(ErrorCode.PATIENT_NOT_FOUND);
            }

            _logger.LogDebug("Found patient {PatientId} for user {UserId}", patient.Id, currentUserId);

            // Build queryable appointments for the patient
            var appointmentsQuery = _context.Appointments
                .Where(a => a.PatientId == patient.Id)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.Specialty)
                .Include(a => a.TimeSlot)
                .Select(a => new AppointmentResponse
                {
                    AppointmentId = a.Id,
                    AppointmentNumber = GenerateAppointmentNumber(a.AppointmentDate, a.Id),
                    Doctor = new DoctorInfoDto
                    {
                        FullName = $"Dr. {a.Doctor.FirstName} {a.Doctor.LastName}".Trim(),
                        Specialty = a.Doctor.Specialty != null ? a.Doctor.Specialty.SpecialtyName : "N/A"
                    },
                    AppointmentDate = a.AppointmentDate.ToString("yyyy-MM-dd"),
                    AppointmentTime = a.AppointmentTime.ToString(@"hh\:mm"),
                    Status = a.Status,
                    TotalFee = a.TotalFee,
                    ReasonForVisit = a.ReasonForVisit,
                    CanCancel = CanCancelAppointment(a.AppointmentDate, a.Status),
                    CanReschedule = CanRescheduleAppointment(a.AppointmentDate, a.Status)
                });

            _logger.LogDebug("Appointments query built for patient {PatientId}", patient.Id);
            return appointmentsQuery;
        }

        public async Task CancelAppointmentAsync(long appointmentId, CancelAppointmentRequest request, int currentUserId)
        {
            _logger.LogInformation("Starting appointment cancellation - AppointmentId: {AppointmentId}, User: {UserId}, Reason: {CancelReason}",
                appointmentId, currentUserId, request?.CancelReason);

            using var transaction = await _context.Database.BeginTransactionAsync();
            _logger.LogDebug("Database transaction started for appointment cancellation");

            try
            {
                // 1. Get patient from current user
                var patient = await _context.Patients
                    .FirstOrDefaultAsync(p => p.UserId == currentUserId);

                if (patient == null)
                {
                    _logger.LogWarning("Patient not found for user {UserId} during cancellation", currentUserId);
                    throw new AppException(ErrorCode.PATIENT_NOT_FOUND);
                }

                // 2. Get appointment with related data
                var appointment = await _context.Appointments
                    .Include(a => a.TimeSlot)
                    .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == patient.Id);

                if (appointment == null)
                {
                    _logger.LogWarning("Appointment {AppointmentId} not found for patient {PatientId}",
                        appointmentId, patient.Id);
                    throw new AppException(ErrorCode.APPOINTMENT_NOT_FOUND);
                }

                _logger.LogDebug("Found appointment {AppointmentId} for patient {PatientId} - Status: {Status}, Date: {AppointmentDate}",
                    appointmentId, patient.Id, appointment.Status, appointment.AppointmentDate);

                // 3. Validate if appointment can be cancelled
                if (!CanCancelAppointment(appointment.AppointmentDate, appointment.Status))
                {
                    _logger.LogWarning("Appointment {AppointmentId} cannot be cancelled - Status: {Status}, Date: {AppointmentDate}",
                        appointmentId, appointment.Status, appointment.AppointmentDate);
                    throw new AppException(ErrorCode.APPOINTMENT_CANNOT_BE_CANCELLED);
                }

                // 4. Update appointment status
                appointment.Status = "cancelled";
                appointment.CancelledBy = currentUserId;
                appointment.CancelReason = request.CancelReason;
                appointment.UpdatedBy = currentUserId.ToString();
                appointment.UpdatedAt = DateTime.Now;

                // 5. Make time slot available again
                var timeSlot = appointment.TimeSlot;
                if (timeSlot != null)
                {
                    timeSlot.IsAvailable = true;
                    timeSlot.UpdatedBy = currentUserId.ToString();
                    timeSlot.UpdatedAt = DateTime.Now;

                    _logger.LogDebug("TimeSlot {SlotId} marked as available again", timeSlot.Id);
                }

                // 6. Create appointment history record
                var history = new AppointmentHistory
                {
                    AppointmentId = appointmentId,
                    ActionType = ActionType.Cancelled,
                    ChangedBy = currentUserId,
                    CreatedBy = currentUserId.ToString(),
                    UpdatedBy = currentUserId.ToString(),
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _context.AppointmentHistories.Add(history);
                _logger.LogDebug("Appointment history record created for cancellation");

                // 7. Save changes
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Appointment {AppointmentId} cancelled successfully by user {UserId}",
                    appointmentId, currentUserId);
            }
            catch (AppException ex)
            {
                _logger.LogWarning("Business logic error during appointment cancellation - AppointmentId: {AppointmentId}, " +
                    "User: {UserId}, Error: {ErrorCode} - {ErrorMessage}",
                    appointmentId, currentUserId, ex.ErrorCode.Code, ex.ErrorCode.Message);
                await transaction.RollbackAsync();
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during appointment cancellation - AppointmentId: {AppointmentId}, User: {UserId}",
                    appointmentId, currentUserId);
                await transaction.RollbackAsync();
                throw;
            }
        }

        // 4. Add helper methods for business logic
        private static bool CanCancelAppointment(DateOnly appointmentDate, string status)
        {
            // Can cancel if appointment is scheduled and at least 24 hours in advance
            var currentDate = DateOnly.FromDateTime(DateTime.Now);
            var daysDifference = appointmentDate.DayNumber - currentDate.DayNumber;

            return status == "scheduled" && daysDifference >= 1;
        }

        private static bool CanRescheduleAppointment(DateOnly appointmentDate, string status)
        {
            // Can reschedule if appointment is scheduled and at least 24 hours in advance
            var currentDate = DateOnly.FromDateTime(DateTime.Now);
            var daysDifference = appointmentDate.DayNumber - currentDate.DayNumber;

            return status == "scheduled" && daysDifference >= 1;
        }

        public async Task<RescheduleAppointmentResponse> RescheduleAppointmentAsync(long appointmentId, RescheduleAppointmentRequest request, int currentUserId)
        {
            _logger.LogInformation("Starting appointment rescheduling - AppointmentId: {AppointmentId}, User: {UserId}, " +
                "NewDate: {NewDate}, NewSlot: {NewSlotId}",
                appointmentId, currentUserId, request.NewAppointmentDate, request.NewSlotId);

            using var transaction = await _context.Database.BeginTransactionAsync();
            _logger.LogDebug("Database transaction started for appointment rescheduling");

            try
            {
                // 1. Get patient from current user
                var patient = await _context.Patients
                    .FirstOrDefaultAsync(p => p.UserId == currentUserId);

                if (patient == null)
                {
                    _logger.LogWarning("Patient not found for user {UserId} during rescheduling", currentUserId);
                    throw new AppException(ErrorCode.PATIENT_NOT_FOUND);
                }

                // 2. Get existing appointment with related data
                var appointment = await _context.Appointments
                    .Include(a => a.TimeSlot)
                    .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == patient.Id);

                if (appointment == null)
                {
                    _logger.LogWarning("Appointment {AppointmentId} not found for patient {PatientId}",
                        appointmentId, patient.Id);
                    throw new AppException(ErrorCode.APPOINTMENT_NOT_FOUND);
                }

                _logger.LogDebug("Found appointment {AppointmentId} - Current date: {CurrentDate}, Current time: {CurrentTime}",
                    appointmentId, appointment.AppointmentDate, appointment.AppointmentTime);

                // 3. Validate if appointment can be rescheduled
                if (!CanRescheduleAppointment(appointment.AppointmentDate, appointment.Status))
                {
                    _logger.LogWarning("Appointment {AppointmentId} cannot be rescheduled - Status: {Status}, Date: {AppointmentDate}",
                        appointmentId, appointment.Status, appointment.AppointmentDate);
                    throw new AppException(ErrorCode.APPOINTMENT_CANNOT_BE_RESCHEDULED);
                }

                // 4. Parse new appointment date
                if (!DateOnly.TryParse(request.NewAppointmentDate, out var newAppointmentDate))
                {
                    _logger.LogWarning("Invalid new appointment date format: {NewAppointmentDate}", request.NewAppointmentDate);
                    throw new AppException(ErrorCode.INVALID_APPOINTMENT_DATE);
                }

                if (newAppointmentDate < DateOnly.FromDateTime(DateTime.Now))
                {
                    _logger.LogWarning("Attempt to reschedule appointment to past date: {NewAppointmentDate}", newAppointmentDate);
                    throw new AppException(ErrorCode.PAST_APPOINTMENT_DATE);
                }

                // 5. Get new time slot with schedule
                var newTimeSlot = await _context.TimeSlots
                    .Include(ts => ts.WorkSchedule)
                    .FirstOrDefaultAsync(ts => ts.Id == request.NewSlotId);

                if (newTimeSlot == null || !newTimeSlot.IsAvailable)
                {
                    _logger.LogWarning("New TimeSlot {NewSlotId} not found or not available", request.NewSlotId);
                    throw new AppException(ErrorCode.TIMESLOT_NOT_AVAILABLE);
                }

                _logger.LogDebug("Found new time slot {NewSlotId} at {NewSlotTime}", request.NewSlotId, newTimeSlot.SlotTime);

                // 6. Validate that the new slot belongs to the same doctor and correct date
                if (newTimeSlot.WorkSchedule.DoctorId != appointment.DoctorId ||
                    newTimeSlot.WorkSchedule.WorkDate != newAppointmentDate)
                {
                    _logger.LogWarning("New TimeSlot {NewSlotId} validation failed - Expected: Doctor {ExpectedDoctorId}, Date {ExpectedDate}; " +
                        "Actual: Doctor {ActualDoctorId}, Date {ActualDate}",
                        request.NewSlotId, appointment.DoctorId, newAppointmentDate,
                        newTimeSlot.WorkSchedule.DoctorId, newTimeSlot.WorkSchedule.WorkDate);
                    throw new AppException(ErrorCode.TIMESLOT_DOCTOR_MISMATCH);
                }

                // 7. Check for appointment conflicts
                var existingAppointment = await _context.Appointments
                    .FirstOrDefaultAsync(a =>
                        a.PatientId == patient.Id &&
                        a.AppointmentDate == newAppointmentDate &&
                        a.AppointmentTime == newTimeSlot.SlotTime &&
                        a.Status != "cancelled" &&
                        a.Id != appointmentId);

                if (existingAppointment != null)
                {
                    _logger.LogWarning("Appointment conflict detected during rescheduling - Patient {PatientId} already has " +
                        "appointment {ExistingAppointmentId} on {NewDate} at {NewTime}",
                        patient.Id, existingAppointment.Id, newAppointmentDate, newTimeSlot.SlotTime);
                    throw new AppException(ErrorCode.APPOINTMENT_CONFLICT);
                }

                // 8. Store old values for history
                var oldSlotId = appointment.SlotId;
                var oldAppointmentDate = appointment.AppointmentDate;
                var oldAppointmentTime = appointment.AppointmentTime;

                _logger.LogDebug("Storing old values - SlotId: {OldSlotId}, Date: {OldDate}, Time: {OldTime}",
                    oldSlotId, oldAppointmentDate, oldAppointmentTime);

                // 9. Update appointment
                appointment.SlotId = request.NewSlotId;
                appointment.AppointmentDate = newAppointmentDate;
                appointment.AppointmentTime = newTimeSlot.SlotTime;
                appointment.UpdatedBy = currentUserId.ToString();
                appointment.UpdatedAt = DateTime.Now;

                // 10. Make old time slot available again
                var oldTimeSlot = appointment.TimeSlot;
                if (oldTimeSlot != null)
                {
                    oldTimeSlot.IsAvailable = true;
                    oldTimeSlot.UpdatedBy = currentUserId.ToString();
                    oldTimeSlot.UpdatedAt = DateTime.Now;

                    _logger.LogDebug("Old TimeSlot {OldSlotId} marked as available", oldTimeSlot.Id);
                }

                // 11. Make new time slot unavailable
                newTimeSlot.IsAvailable = false;
                newTimeSlot.UpdatedBy = currentUserId.ToString();
                newTimeSlot.UpdatedAt = DateTime.Now;

                _logger.LogDebug("New TimeSlot {NewSlotId} marked as unavailable", request.NewSlotId);

                // 12. Create appointment history record
                var history = new AppointmentHistory
                {
                    AppointmentId = appointmentId,
                    OldSlotId = oldSlotId,
                    OldAppointmentDate = oldAppointmentDate.ToDateTime(TimeOnly.MinValue),
                    OldAppointmentTime = TimeSpan.FromTicks(oldAppointmentTime.Ticks),
                    ActionType = ActionType.Updated,
                    ChangedBy = currentUserId,
                    CreatedBy = currentUserId.ToString(),
                    UpdatedBy = currentUserId.ToString(),
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _context.AppointmentHistories.Add(history);
                _logger.LogDebug("Appointment history record created for rescheduling");

                // 13. Save changes
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Appointment {AppointmentId} rescheduled successfully - From: {OldDate} {OldTime} to {NewDate} {NewTime}",
                    appointmentId, oldAppointmentDate, oldAppointmentTime, newAppointmentDate, newTimeSlot.SlotTime);

                // 14. Create response
                var response = new RescheduleAppointmentResponse
                {
                    AppointmentId = appointmentId,
                    NewAppointmentDate = newAppointmentDate.ToString("yyyy-MM-dd"),
                    NewAppointmentTime = newTimeSlot.SlotTime.ToString(@"hh\:mm")
                };

                return response;
            }
            catch (AppException ex)
            {
                _logger.LogWarning("Business logic error during appointment rescheduling - AppointmentId: {AppointmentId}, " +
                    "User: {UserId}, Error: {ErrorCode} - {ErrorMessage}",
                    appointmentId, currentUserId, ex.ErrorCode.Code, ex.ErrorCode.Message);
                await transaction.RollbackAsync();
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during appointment rescheduling - AppointmentId: {AppointmentId}, User: {UserId}",
                    appointmentId, currentUserId);
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
