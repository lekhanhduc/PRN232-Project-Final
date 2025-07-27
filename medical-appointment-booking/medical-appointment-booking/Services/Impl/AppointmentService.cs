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

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. Validate input
                await ValidateAppointmentRequest(request, currentUserId);

                // 2. Get patient from current user
                var patient = await _context.Patients
                    .FirstOrDefaultAsync(p => p.UserId == currentUserId);

                if (patient == null)
                {
                    throw new AppException(ErrorCode.PATIENT_NOT_FOUND);
                }


                // 3. Get doctor information with specialty
                var doctor = await _context.Doctors
                    .Include(d => d.User)
                    .Include(d => d.Specialty)
                    .FirstOrDefaultAsync(d => d.Id == request.DoctorId);

                if (doctor == null || !doctor.IsAvailable)
                {
                    throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
                }  

                // 4. Get time slot information with schedule
                var timeSlot = await _context.TimeSlots
                    .Include(ts => ts.WorkSchedule)
                    .FirstOrDefaultAsync(ts => ts.Id == request.SlotId);

                if (timeSlot == null || !timeSlot.IsAvailable)
                {
                    throw new AppException(ErrorCode.TIMESLOT_NOT_AVAILABLE);
                }
                // 5. Get service package for fee calculation
                var servicePackage = await _context.ServicePackages
                    .FirstOrDefaultAsync(sp => sp.Id == request.PackageId);

                if (servicePackage == null || !servicePackage.IsActive)
                {
                    throw new AppException(ErrorCode.SERVICE_PACKAGE_NOT_FOUND);
                }

                // 6. Parse appointment date
                if (!DateOnly.TryParse(request.AppointmentDate, out var appointmentDate))
                {
                    throw new AppException(ErrorCode.INVALID_APPOINTMENT_DATE);
                }

                // 7. Validate that the slot belongs to the requested doctor and date
                if (timeSlot.WorkSchedule.DoctorId != request.DoctorId ||
                    timeSlot.WorkSchedule.WorkDate != appointmentDate)
                {
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


                // 11. Update time slot availability
                timeSlot.IsAvailable = false;
                await _context.SaveChangesAsync();

                // 12. Generate appointment number
                var appointmentNumber = GenerateAppointmentNumber(appointmentDate, appointment.Id);

                // 13. Commit transaction
                await transaction.CommitAsync();

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

                return response;
            }
            catch (AppException ex)
            {
                await transaction.RollbackAsync();
                throw;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private async Task ValidateAppointmentRequest(CreateAppointmentRequest request, int currentUserId)
        {

            // Validate appointment date
            if (!DateOnly.TryParse(request.AppointmentDate, out var appointmentDate))
            {
                throw new AppException(ErrorCode.INVALID_APPOINTMENT_DATE);
            }

            if (appointmentDate < DateOnly.FromDateTime(DateTime.Now))
            {
                throw new AppException(ErrorCode.PAST_APPOINTMENT_DATE);
            }

            // Check if doctor exists and is available
            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.Id == request.DoctorId);

            if (doctor == null || !doctor.IsAvailable)
            {
                throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
            }

            // Check if time slot exists and is available
            var timeSlot = await _context.TimeSlots
                .Include(ts => ts.WorkSchedule)
                .FirstOrDefaultAsync(ts => ts.Id == request.SlotId);

            if (timeSlot == null || !timeSlot.IsAvailable)
            {
                throw new AppException(ErrorCode.TIMESLOT_NOT_AVAILABLE);
            }

            // Validate that the slot belongs to the requested doctor and date
            if (timeSlot.WorkSchedule.DoctorId != request.DoctorId ||
                timeSlot.WorkSchedule.WorkDate != appointmentDate)
            {
                throw new AppException(ErrorCode.TIMESLOT_DOCTOR_MISMATCH);
            }

            // Check if service package exists
            var servicePackage = await _context.ServicePackages
                .FirstOrDefaultAsync(sp => sp.Id == request.PackageId);

            if (servicePackage == null || !servicePackage.IsActive)
            {
                throw new AppException(ErrorCode.SERVICE_PACKAGE_NOT_FOUND);
            }

            // Check if patient already has appointment at this time
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserId == currentUserId);

            if (patient == null)
            {
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
                throw new AppException(ErrorCode.APPOINTMENT_CONFLICT);
            }
        }

        private static string GenerateAppointmentNumber(DateOnly appointmentDate, long appointmentId)
        {
            // Format: AP + YYYYMMDD + 4-digit sequential number
            return $"AP{appointmentDate:yyyyMMdd}{appointmentId:D4}";
        }

        public async Task<IQueryable<AppointmentResponse>> GetMyAppointmentsAsync(int currentUserId)
        {
            // Get patient from current user
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserId == currentUserId);

            if (patient == null)
            {
                throw new AppException(ErrorCode.PATIENT_NOT_FOUND);
            }

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
                        DoctorId = a.DoctorId,
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

            return appointmentsQuery;
        }

        public async Task CancelAppointmentAsync(long appointmentId, CancelAppointmentRequest request, int currentUserId)
        {

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. Get patient from current user
                var patient = await _context.Patients
                    .FirstOrDefaultAsync(p => p.UserId == currentUserId);

                if (patient == null)
                {
                    throw new AppException(ErrorCode.PATIENT_NOT_FOUND);
                }

                // 2. Get appointment with related data
                var appointment = await _context.Appointments
                    .Include(a => a.TimeSlot)
                    .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == patient.Id);

                if (appointment == null)
                {

                    throw new AppException(ErrorCode.APPOINTMENT_NOT_FOUND);
                }


                // 3. Validate if appointment can be cancelled
                if (!CanCancelAppointment(appointment.AppointmentDate, appointment.Status))
                {
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
                // 7. Save changes
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

            }
            catch (AppException ex)
            {
                await transaction.RollbackAsync();
                throw;
            }
            catch (Exception ex)
            {
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
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. Get patient from current user
                var patient = await _context.Patients
                    .FirstOrDefaultAsync(p => p.UserId == currentUserId);

                if (patient == null)
                {
                    throw new AppException(ErrorCode.PATIENT_NOT_FOUND);
                }

                // 2. Get existing appointment with related data
                var appointment = await _context.Appointments
                    .Include(a => a.TimeSlot)
                    .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == patient.Id);

                if (appointment == null)
                {                   
                    throw new AppException(ErrorCode.APPOINTMENT_NOT_FOUND);
                }


                // 3. Validate if appointment can be rescheduled
                if (!CanRescheduleAppointment(appointment.AppointmentDate, appointment.Status))
                {
                    throw new AppException(ErrorCode.APPOINTMENT_CANNOT_BE_RESCHEDULED);
                }

                // 4. Parse new appointment date
                if (!DateOnly.TryParse(request.NewAppointmentDate, out var newAppointmentDate))
                {
                    throw new AppException(ErrorCode.INVALID_APPOINTMENT_DATE);
                }

                if (newAppointmentDate < DateOnly.FromDateTime(DateTime.Now))
                {
                    throw new AppException(ErrorCode.PAST_APPOINTMENT_DATE);
                }

                // 5. Get new time slot with schedule
                var newTimeSlot = await _context.TimeSlots
                    .Include(ts => ts.WorkSchedule)
                    .FirstOrDefaultAsync(ts => ts.Id == request.NewSlotId);

                if (newTimeSlot == null || !newTimeSlot.IsAvailable)
                {
                    throw new AppException(ErrorCode.TIMESLOT_NOT_AVAILABLE);
                }


                // 6. Validate that the new slot belongs to the same doctor and correct date
                if (newTimeSlot.WorkSchedule.DoctorId != appointment.DoctorId ||
                    newTimeSlot.WorkSchedule.WorkDate != newAppointmentDate)
                {
 
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
                    
                    throw new AppException(ErrorCode.APPOINTMENT_CONFLICT);
                }

                // 8. Store old values for history
                var oldSlotId = appointment.SlotId;
                var oldAppointmentDate = appointment.AppointmentDate;
                var oldAppointmentTime = appointment.AppointmentTime;

              

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

                }

                // 11. Make new time slot unavailable
                newTimeSlot.IsAvailable = false;
                newTimeSlot.UpdatedBy = currentUserId.ToString();
                newTimeSlot.UpdatedAt = DateTime.Now;


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

                // 13. Save changes
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();


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
                await transaction.RollbackAsync();
                throw;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}