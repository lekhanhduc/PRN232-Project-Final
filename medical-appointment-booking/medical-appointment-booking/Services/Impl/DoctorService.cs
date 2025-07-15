using System.Numerics;
using System.Text;
using Azure.Core;
using CloudinaryDotNet.Core;
using medical_appointment_booking.Common;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace medical_appointment_booking.Services.Impl
{
    public class DoctorService : IDoctorService
    {

        private readonly DoctorRepository doctorRepository;
        private readonly UserRepository userRepository;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly PasswordHasher<User> passwordHasher;
        private readonly RoleRepository roleRepository;
        private readonly IMailService mailService;
        private readonly SpecialtyRepository specialtyRepository;
        private readonly ScheduleRepository scheduleRepository;
        private readonly ILogger<DoctorService> logger;

        public DoctorService(
            DoctorRepository doctorRepository,
            UserRepository userRepository,
            IHttpContextAccessor httpContextAccessor,
            RoleRepository roleRepository,
            IMailService mailService,
            SpecialtyRepository specialtyRepository,
            ScheduleRepository scheduleRepository,
            ILogger<DoctorService> logger)
        {
            this.doctorRepository = doctorRepository;
            this.userRepository = userRepository;
            passwordHasher = new PasswordHasher<User>();
            this.httpContextAccessor = httpContextAccessor;
            this.roleRepository = roleRepository;
            this.mailService = mailService;
            this.specialtyRepository = specialtyRepository;
            this.scheduleRepository = scheduleRepository;
            this.logger = logger;
        }

        public async Task<PageResponse<DoctorDetailResponse>> GetAllWithSearch(int page, int size, string? keyword, string? specialtyName,
            Gender? gender, bool? isAvailable, string? orderBy)
        {
            //var doctors = await doctorRepository.GetAll(page, size, keyword);
            //var totalElements = await doctorRepository.GetTotalCount(keyword);

            var query = doctorRepository.GetDoctorsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(specialtyName))
            {
                query = query.Where(d => d.Specialty.SpecialtyName.Contains(specialtyName));
            }

            if (gender.HasValue)
            {
                query = query.Where(d => d.Gender == gender.Value);
            }

            if (isAvailable.HasValue)
            {
                query = query.Where(d => d.IsAvailable == isAvailable.Value);
            }

            // Apply ordering
            if (!string.IsNullOrEmpty(orderBy))
            {
                switch (orderBy.ToLower())
                {
                    case "experience":
                        query = query.OrderBy(d => d.YearsOfExperience);
                        break;
                    case "experience_desc":
                        query = query.OrderByDescending(d => d.YearsOfExperience);
                        break;
                    case "fee":
                        query = query.OrderBy(d => d.ConsultationFee);
                        break;
                    case "fee_desc":
                        query = query.OrderByDescending(d => d.ConsultationFee);
                        break;
                    default:
                        query = query.OrderBy(d => d.FirstName);
                        break;
                }
            }
            else
            {
                query = query.OrderBy(d => d.FirstName);
            }

            // Get total count
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / size);

            // Apply pagination
            var doctors = await query
                .Skip((page - 1) *size)
                .Take(size)
                .ToListAsync();

            var doctorResponses = new List<DoctorDetailResponse>();

            foreach (var doctor in doctors)
            {
                doctorResponses.Add(new DoctorDetailResponse
                {
                    DoctorId = doctor.Id,
                    FullName = doctor.FirstName + " " + doctor.LastName,
                    Email = doctor.User.Email,
                    Phone = doctor.User.Phone,
                    Specialty = new SpecialtyDto
                    {
                        SpecialtyId = doctor.Specialty.Id,
                        SpecialtyName = doctor.Specialty.SpecialtyName
                    },
                    LicenseNumber = doctor.LicenseNumber,
                    Degree = doctor.Degree,
                    ConsultationFee = doctor.ConsultationFee,
                    IsAvailable = doctor.IsAvailable,
                    Gender = doctor.Gender,
                    YearsOfExperience = doctor.YearsOfExperience,
                    Bio = doctor.Bio,

                });
            }

            return new PageResponse<DoctorDetailResponse>
            {
                CurrentPages = page,
                PageSizes = size,
                TotalPages = size > 0 ? (int)Math.Ceiling((decimal)totalCount / size) : 0,
                TotalElements = totalCount,
                Items = doctorResponses
            };
        }

        public async Task<DoctorCreationResponse> CreateDoctorAsync(DoctorCreationRequest request)
        {
            var user = await userRepository.FindUserByEmail(request.Email);
            if (user != null)
            {
                throw new AppException(ErrorCode.USER_EXISTED);
            }

            var existingDoctor = await doctorRepository.GetDoctorByLicenseNumber(request.LicenseNumber);
            if (existingDoctor != null)
            {
                throw new AppException(ErrorCode.LICENSENUMBER_EXISTED);
            }

            var specialty = await specialtyRepository.GetSpecialty(request.SpecialtyId);
            if (specialty == null)
            {
                throw new AppException(ErrorCode.SPECIALTY_NOT_FOUND);
            }

            var role = await roleRepository.FindByRoleName(DefinitionRole.DOCTOR);
            if (role == null)
            {
                role = new Role();
                role.Name = DefinitionRole.DOCTOR;
                await roleRepository.CreateRole(role);
            }

            string password = GenerateRandomPassword();
            logger.LogInformation("Mật khẩu {}", password);

            User newUser = new User();
            newUser.Email = request.Email;
            newUser.Password = passwordHasher.HashPassword(newUser, password);
            newUser.Role = role;
            newUser.Phone = request.Phone;
            newUser.UserStatus = UserStatus.PENDING_VERIFICATION;

            await userRepository.CreateUserAsync(newUser);

            var newDoctor = new Doctor
            {
                UserId = newUser.Id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                SpecialtyId = request.SpecialtyId,
                LicenseNumber = request.LicenseNumber,
                Degree = request.Degree,
                ConsultationFee = request.ConsultationFee,
                Gender = request.Gender,
                YearsOfExperience = request.YearsOfExperience,
                Bio = request.Bio,
                Avatar = request.Avatar,
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await doctorRepository.CreateDoctorAsync(newDoctor);

            await mailService.SendDoctorWelcomeEmail(
                to: newUser.Email,
                doctorName: newDoctor.FirstName + " " + newDoctor.LastName,
                email: newUser.Email,
                temporaryPassword: password,
                licenseNumber: newDoctor.LicenseNumber,
                specialty: specialty.SpecialtyName,
                consultationFee: newDoctor.ConsultationFee,
                registrationDate: newDoctor.CreatedAt
            );

            return new DoctorCreationResponse
            {
                Id = newDoctor.Id,
                UserId = newDoctor.UserId,
                UserName = newDoctor.FirstName + " " + newDoctor.LastName,
                UserEmail = newUser.Email,
                SpecialtyId = specialty.Id,
                SpecialtyName = specialty.SpecialtyName,
                LicenseNumber = newDoctor.LicenseNumber,
                Degree = newDoctor.Degree,
                ConsultationFee = newDoctor.ConsultationFee,
                IsAvailable = newDoctor.IsAvailable,
                Gender = newDoctor.Gender,
                YearsOfExperience = newDoctor.YearsOfExperience,
                Bio = newDoctor.Bio,
                CreatedAt = newDoctor.CreatedAt
            };
        }

        public async Task<DoctorDetailResponse> GetDoctorByIdAsync(long id)
        {
            var doctor = await doctorRepository.GetDoctorByIdAsync(id);
            if (doctor == null)
            {
                throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
            }

            var specialty = await specialtyRepository.GetSpecialty(doctor.SpecialtyId);

            return new DoctorDetailResponse
            {
                DoctorId = doctor.Id,
                FullName = $"{doctor.FirstName} {doctor.LastName}",
                Specialty = new SpecialtyDto
                {
                    SpecialtyId = specialty.Id,
                    SpecialtyName = specialty.SpecialtyName,
                    Description = specialty.Description
                },
                LicenseNumber = doctor.LicenseNumber,
                Degree = doctor.Degree,
                YearsOfExperience = doctor.YearsOfExperience,
                ConsultationFee = doctor.ConsultationFee,
                Bio = doctor.Bio,
                Gender = doctor.Gender,
                IsAvailable = doctor.IsAvailable
            };
        }

        public async Task<PageResponse<DoctorSearchResponse>> SearchDoctorsAsync(string? specialtyName,
            Gender? gender, bool? isAvailable, string? orderBy, int page, int pageSize)
        {
            try
            {
                // Build the base query
                var query = doctorRepository.GetDoctorsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(specialtyName))
                {
                    query = query.Where(d => d.Specialty.SpecialtyName.Contains(specialtyName));
                }

                if (gender.HasValue)
                {
                    query = query.Where(d => d.Gender == gender.Value);
                }

                if (isAvailable.HasValue)
                {
                    query = query.Where(d => d.IsAvailable == isAvailable.Value);
                }

                // Apply ordering
                if (!string.IsNullOrEmpty(orderBy))
                {
                    switch (orderBy.ToLower())
                    {
                        case "experience":
                            query = query.OrderBy(d => d.YearsOfExperience);
                            break;
                        case "experience_desc":
                            query = query.OrderByDescending(d => d.YearsOfExperience);
                            break;
                        case "fee":
                            query = query.OrderBy(d => d.ConsultationFee);
                            break;
                        case "fee_desc":
                            query = query.OrderByDescending(d => d.ConsultationFee);
                            break;
                        default:
                            query = query.OrderBy(d => d.FirstName);
                            break;
                    }
                }
                else
                {
                    query = query.OrderBy(d => d.FirstName);
                }

                // Get total count
                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                // Apply pagination
                var doctors = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var result = new List<DoctorSearchResponse>();
                foreach (var doctor in doctors)
                {
                    var workSchedules = await GetDoctorWorkSchedules(doctor.Id);
                    result.Add(new DoctorSearchResponse
                    {
                        DoctorId = doctor.Id,
                        FullName = $"Dr. {doctor.FirstName} {doctor.LastName}".Trim(),
                        Specialty = new SpecialtyDto
                        {
                            SpecialtyId = doctor.Specialty.Id,
                            SpecialtyName = doctor.Specialty.SpecialtyName
                        },
                        Gender = doctor.Gender,
                        YearsOfExperience = doctor.YearsOfExperience,
                        ConsultationFee = doctor.ConsultationFee,
                        Bio = doctor.Bio,
                        WorkSchedules = workSchedules
                    });
                }

                return new PageResponse<DoctorSearchResponse>
                {
                    CurrentPages = page,
                    PageSizes = pageSize,
                    TotalPages = totalPages,
                    TotalElements = totalCount,
                    Items = result
                };
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error searching doctors");
                throw;
            }
        }

        private async Task<List<WorkScheduleDto>> GetDoctorWorkSchedules(long doctorId)
        {
            // This method should fetch work schedules from your schedule repository
            // Replace with your actual implementation
            var schedules = await scheduleRepository.GetDoctorSchedulesAsync(doctorId);


            return schedules.Select(s => new WorkScheduleDto
            {
                ScheduleId = s.Id,
                WorkDate = s.WorkDate.ToString("yyyy-MM-dd"),
                StartTime = s.StartTime.ToString(@"hh\:mm"),
                EndTime = s.EndTime.ToString(@"hh\:mm"),
                TimeSlots = s.TimeSlots?.Select(ts => new TimeSlotDto
                {
                    SlotId = ts.Id,
                    SlotTime = ts.SlotTime.ToString(@"hh\:mm"),
                    IsAvailable = ts.IsAvailable
                }).ToList() ?? new List<TimeSlotDto>()
            }).ToList();
        }

        private string GenerateRandomPassword(int length = 12)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
            var random = new Random();
            var password = new StringBuilder();

            // Đảm bảo có ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt
            password.Append(chars[random.Next(0, 26)]); // Chữ hoa
            password.Append(chars[random.Next(26, 52)]); // Chữ thường  
            password.Append(chars[random.Next(52, 62)]); // Số
            password.Append(chars[random.Next(62, chars.Length)]); // Ký tự đặc biệt

            // Điền các ký tự còn lại
            for (int i = 4; i < length; i++)
            {
                password.Append(chars[random.Next(chars.Length)]);
            }

            // Shuffle để không có pattern cố định
            return new string(password.ToString().ToCharArray().OrderBy(x => random.Next()).ToArray());
        }

        public async Task DeleteDoctor(long Id)
        {
            var existingDoctor = await doctorRepository.GetDoctorByIdAsync(Id);
            if (existingDoctor == null)
            {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }
            var existingUser = await userRepository.FindUserById(existingDoctor.UserId);
            if (existingUser == null)
            {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }
            await doctorRepository.DeleteDoctorAsync(Id);
            await userRepository.DeleteUserAsync(existingUser.Id);
        }

        public async Task<DoctorDetailResponse> UpdateDoctor(DoctorUpdateRequest request)
        {
            //var accountIdClaim = httpContextAccessor.HttpContext?.User.FindFirst("userId")?.Value;
            //if (string.IsNullOrEmpty(accountIdClaim))
            //{
            //    throw new AppException(ErrorCode.UNAUTHORIZED);
            //}

            //var accountId = int.Parse(accountIdClaim);

            var existingDoctor = await doctorRepository.GetDoctorByIdAsync(request.Id);
            if (existingDoctor == null)
            {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }

            if (!string.IsNullOrWhiteSpace(request.FirstName))
            {
                existingDoctor.FirstName = request.FirstName.Trim();
            }

            if (!string.IsNullOrWhiteSpace(request.LastName))
            {
                existingDoctor.LastName = request.LastName.Trim();
            }

            if (request.Gender.HasValue)
            {
                existingDoctor.Gender = request.Gender.Value;
            }

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                existingDoctor.User.Email = request.Email.Trim();
            }
            if (request.SpecialtyId.HasValue)
            {
                existingDoctor.SpecialtyId = request.SpecialtyId;
            }
            if (!string.IsNullOrWhiteSpace(request.LicenseNumber))
            {
                existingDoctor.LicenseNumber = request.LicenseNumber.Trim();
            }
            if (!string.IsNullOrWhiteSpace(request.Degree))
            {
                existingDoctor.Degree = request.Degree;
            }
            if (request.ConsultationFee.HasValue)
            {
                existingDoctor.ConsultationFee = (decimal)request.ConsultationFee;
            }
            if (request.IsAvailable.HasValue)
            {
                existingDoctor.IsAvailable = (bool)request.IsAvailable;
            }
            if (request.Gender.HasValue)
            {
                existingDoctor.Gender = request.Gender;
            }
            if (request.YearsOfExperience.HasValue)
            {
                existingDoctor.YearsOfExperience = (int)request.YearsOfExperience;
            }
            if (request.YearsOfExperience.HasValue)
            {
                existingDoctor.YearsOfExperience = (int)request.YearsOfExperience;
            }
            if (!string.IsNullOrWhiteSpace(request.Bio))
            {
                existingDoctor.Bio = request.Bio;
            }

            existingDoctor.UpdatedAt = DateTime.UtcNow;

            await doctorRepository.UpdateDoctorAsync(existingDoctor);

            return new DoctorDetailResponse
            {
                DoctorId = existingDoctor.Id,
                FullName = existingDoctor.FirstName + " " + existingDoctor.LastName,
                Email = existingDoctor.User.Email,
                Phone = existingDoctor.User.Phone,
                Specialty = new SpecialtyDto
                {
                    SpecialtyId = existingDoctor.Specialty.Id,
                    SpecialtyName = existingDoctor.Specialty.SpecialtyName
                },
                LicenseNumber = existingDoctor.LicenseNumber,
                Degree = existingDoctor.Degree,
                ConsultationFee = existingDoctor.ConsultationFee,
                IsAvailable = existingDoctor.IsAvailable,
                Gender = existingDoctor.Gender,
                YearsOfExperience = existingDoctor.YearsOfExperience,
                Bio = existingDoctor.Bio,
            };
        }
        //public async Task<DoctorCreationResponse> CreateDoctorScheduleAsync(ScheduleCreateRequest request)
        //{
        //    var existingDoctor = await doctorRepository.GetDoctorByIdAsync(request.DoctorId);
        //    if (existingDoctor == null)
        //    {
        //        throw new AppException(ErrorCode.USER_NOT_EXISTED);
        //    }


        //    var newDoctorSchedule = new WorkSchedule
        //    {
        //        DoctorId = request.DoctorId,
        //        WorkDate = request.WorkDate,
        //        StartTime = request.StartTime,
        //        EndTime = request.EndTime,
        //        MaxPatients = request.MaxPatients,
        //        IsAvailable = request.IsAvailable,     
        //        TimeSlots = request.TimeSlots
        //    };

        //    await scheduleRepository.CreateScheduleAsync(newDoctorSchedule);

         

        //    return new DoctorCreationResponse
        //    {
        //        Id = newDoctor.Id,
        //        UserId = newDoctor.UserId,
        //        UserName = newDoctor.FirstName + " " + newDoctor.LastName,
        //        UserEmail = newUser.Email,
        //        SpecialtyId = specialty.Id,
        //        SpecialtyName = specialty.SpecialtyName,
        //        LicenseNumber = newDoctor.LicenseNumber,
        //        Degree = newDoctor.Degree,
        //        ConsultationFee = newDoctor.ConsultationFee,
        //        IsAvailable = newDoctor.IsAvailable,
        //        Gender = newDoctor.Gender,
        //        YearsOfExperience = newDoctor.YearsOfExperience,
        //        Bio = newDoctor.Bio,
        //        CreatedAt = newDoctor.CreatedAt
        //    };
        //}
    }
}
