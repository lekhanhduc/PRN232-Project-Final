using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;

namespace medical_appointment_booking.Services.Impl
{
    public class DoctorScheduleService : IDoctorScheduleService
    {
        private readonly DoctorScheduleRepository _doctorScheduleRepository;
        private readonly DoctorRepository _doctorRepository;

        public DoctorScheduleService(DoctorScheduleRepository doctorScheduleRepository, DoctorRepository doctorRepository)
        {
            _doctorScheduleRepository = doctorScheduleRepository;
            _doctorRepository = doctorRepository;
        }

        public async Task<Doctor> GetDoctorByUserIdAsync(long userId)
        {
            var doctor = await _doctorRepository.GetDoctorByUserIdAsync(userId);
            if (doctor == null)
            {
                throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
            }
            return doctor;
        }

        public async Task<List<WorkScheduleResponse>> GetMyWorkScheduleAsync(long userId, DateOnly? fromDate = null, DateOnly? toDate = null)
        {
            var doctorId = (await GetDoctorByUserIdAsync(userId)).Id;

            // Validate doctor exists
            if (!await _doctorScheduleRepository.DoctorExistsAsync(doctorId))
            {
                throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
            }

            // Set default date range if not provided
            var startDate = fromDate ?? DateOnly.FromDateTime(DateTime.Today);
            var endDate = toDate ?? DateOnly.FromDateTime(DateTime.Today.AddDays(7));

            // Validate date range
            if (startDate > endDate)
            {
                throw new AppException(ErrorCode.INVALID_DATE_RANGE);
            }

            var workSchedules = await _doctorScheduleRepository.GetDoctorWorkSchedulesAsync(doctorId, startDate, endDate);

            var response = new List<WorkScheduleResponse>();

            foreach (var schedule in workSchedules)
            {
                var timeSlots = new List<TimeSlotDoctorResponse>();

                foreach (var timeSlot in schedule.TimeSlots.OrderBy(ts => ts.SlotTime))
                {
                    var appointment = timeSlot.Appointments?.FirstOrDefault(a =>
                        a.AppointmentDate == schedule.WorkDate &&
                        a.Status != "cancelled");

                    var slotResponse = new TimeSlotDoctorResponse
                    {
                        SlotId = timeSlot.Id,
                        SlotTime = timeSlot.SlotTime,
                        SlotTimeFormatted = timeSlot.SlotTime.ToString(@"HH\:mm"),
                        IsAvailable = appointment == null && timeSlot.IsAvailable
                    };

                    if (appointment != null)
                    {
                        slotResponse.Appointment = new AppointmentSummaryResponse
                        {
                            AppointmentId = appointment.Id,
                            Patient = new PatientSummaryResponse
                            {
                                PatientId = appointment.Patient.Id,
                                FullName = $"{appointment.Patient.FirstName} {appointment.Patient.LastName}",
                                Phone = appointment.Patient.Phone
                            }
                        };
                    }

                    timeSlots.Add(slotResponse);
                }

                response.Add(new WorkScheduleResponse
                {
                    ScheduleId = schedule.Id,
                    WorkDate = schedule.WorkDate,
                    StartTime = schedule.StartTime,
                    EndTime = schedule.EndTime,
                    MaxPatients = schedule.MaxPatients,
                    IsAvailable = schedule.IsAvailable,
                    TimeSlots = timeSlots
                });
            }
            return response;
        }

        public async Task<PageResponse<AppointmentDoctorResponse>> GetMyAppointmentsAsync(long userId, DoctorAppointmentFilterRequest request)
        {
            var doctorId = (await GetDoctorByUserIdAsync(userId)).Id;

            // Validate doctor exists
            if (!await _doctorScheduleRepository.DoctorExistsAsync(doctorId))
            {
                throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
            }

            var appointmentsPage = await _doctorScheduleRepository.GetDoctorAppointmentsAsync(
                doctorId,
                request.AppointmentDate,
                request.Status,
                request.OrderBy,
                request.Page,
                request.PageSize);

            var appointmentResponses = appointmentsPage.Items.Select(appointment => new AppointmentDoctorResponse
            {
                AppointmentId = appointment.Id,
                Patient = new PatientInfoDetailResponse
                {
                    PatientId = appointment.Patient.Id,
                    FullName = $"{appointment.Patient.FirstName} {appointment.Patient.LastName}",
                    Phone = appointment.Patient.User.Phone,
                    Email = appointment.Patient.User.Email,
                    DateOfBirth = appointment.Patient.Dob,
                    Gender = appointment.Patient.Gender.ToString(),
                    Address = appointment.Patient.Address,
                    Avatar = appointment.Patient.Avatar
                },
                AppointmentDate = appointment.AppointmentDate,
                AppointmentTime = appointment.AppointmentTime,
                Status = appointment.Status,
                ReasonForVisit = appointment.ReasonForVisit,
                TotalFee = appointment.TotalFee,
                ConsultationFee = appointment.ConsultationFee,
                ServicePackage = appointment.ServicePackage != null ? new ServicePackageResponse
                {
                    PackageId = appointment.ServicePackage.Id,
                    PackageName = appointment.ServicePackage.PackageName,
                    Description = appointment.ServicePackage.Description,
                    Fee = appointment.ServicePackage.Fee,
                    DurationMinutes = appointment.ServicePackage.DurationMinutes
                } : null,
                CreatedAt = appointment.CreatedAt
            }).ToList();

            return new PageResponse<AppointmentDoctorResponse>
            {
                CurrentPages = appointmentsPage.CurrentPages,
                PageSizes = appointmentsPage.PageSizes,
                TotalPages = appointmentsPage.TotalPages,
                TotalElements = appointmentsPage.TotalElements,
                Items = appointmentResponses
            };
        }

        public async Task<bool> MarkPatientArrivedAsync(long appointmentId, long userId)
        {
            var doctorId = (await GetDoctorByUserIdAsync(userId)).Id;

            // Validate doctor exists
            if (!await _doctorScheduleRepository.DoctorExistsAsync(doctorId))
            {
                throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
            }

            // Check if appointment belongs to this doctor
            if (!await _doctorScheduleRepository.CheckAppointmentBelongsToDoctorAsync(appointmentId, doctorId))
            {
                throw new AppException(ErrorCode.APPOINTMENT_NOT_FOUND);
            }

            // Get appointment details
            var appointment = await _doctorScheduleRepository.GetAppointmentByIdAsync(appointmentId);
            if (appointment == null)
            {
                throw new AppException(ErrorCode.APPOINTMENT_NOT_FOUND);
            }

            // Check if appointment is in valid status
            if (appointment.Status != "scheduled")
            {
                return false; // Already marked as arrived or in different status
            }

            // Check if appointment is for today or in the past
            if (appointment.AppointmentDate > DateOnly.FromDateTime(DateTime.Today))
            {
                throw new AppException(ErrorCode.FUTURE_APPOINTMENT_ARRIVAL);
            }

            // Update status to arrived
            return await _doctorScheduleRepository.UpdateAppointmentStatusAsync(appointmentId, "arrived");
        }

        public async Task<bool> CompleteAppointmentAsync(long appointmentId, long userId, CompleteAppointmentRequest request)
        {
            var doctorId = (await GetDoctorByUserIdAsync(userId)).Id;

            // Validate doctor exists
            if (!await _doctorScheduleRepository.DoctorExistsAsync(doctorId))
            {
                throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
            }

            // Check if appointment belongs to this doctor
            if (!await _doctorScheduleRepository.CheckAppointmentBelongsToDoctorAsync(appointmentId, doctorId))     
            {
                throw new AppException(ErrorCode.APPOINTMENT_NOT_FOUND);
            }

            // Get appointment details
            var appointment = await _doctorScheduleRepository.GetAppointmentByIdAsync(appointmentId);
            if (appointment == null)
            {
                throw new AppException(ErrorCode.APPOINTMENT_NOT_FOUND);
            }

            // Check if appointment is in valid status (should be arrived or scheduled)
            if (appointment.Status != "arrived" && appointment.Status != "scheduled")
            {
                throw new AppException(ErrorCode.INVALID_APPOINTMENT_STATUS_FOR_COMPLETION);
            }

            // Update status to completed
            return await _doctorScheduleRepository.UpdateAppointmentStatusAsync(appointmentId, "completed", request.Notes);
        }

        public async Task<LeaveResponse> RequestLeaveAsync(long userId, LeaveRequest request)
        {
            var doctorId = (await GetDoctorByUserIdAsync(userId)).Id;

            // Validate doctor exists
            if (!await _doctorScheduleRepository.DoctorExistsAsync(doctorId))
            {
                throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
            }

            // Validate leave date is not in the past
            if (request.LeaveDate <= DateOnly.FromDateTime(DateTime.Today))
            {
                throw new AppException(ErrorCode.LEAVE_DATE_IN_PAST);
            }

            // Check for existing leave on the same date
            if (await _doctorScheduleRepository.CheckLeaveConflictAsync(doctorId, request.LeaveDate))
            {
                throw new AppException(ErrorCode.LEAVE_CONFLICT);
            }

            // Create leave request
            var leave = new DoctorLeave
            {
                DoctorId = doctorId,
                LeaveDate = request.LeaveDate,
                Reason = request.Reason
            };

            var createdLeave = await _doctorScheduleRepository.CreateLeaveRequestAsync(leave);

            return new LeaveResponse
            {
                LeaveId = createdLeave.Id,
                DoctorId = createdLeave.DoctorId,
                LeaveDate = createdLeave.LeaveDate,
                Reason = createdLeave.Reason,
                RequestedAt = DateTime.UtcNow
            };
        }
    }
}
