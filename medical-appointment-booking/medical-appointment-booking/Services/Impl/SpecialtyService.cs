using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;

namespace medical_appointment_booking.Services.Impl
{
    public class SpecialtyService : ISpecialtyService
    {

        private readonly SpecialtyRepository specialtyRepository;
        private readonly DoctorRepository doctorRepository;
        private readonly PatientRepository patientRepository;

        public SpecialtyService(SpecialtyRepository specialtyRepository, DoctorRepository doctorRepository, PatientRepository patientRepository)
        {
            this.specialtyRepository = specialtyRepository;
            this.doctorRepository = doctorRepository;
            this.patientRepository = patientRepository;
        }

        public async Task<SpecialtyCreationResponse> Creation(SpecialtyCreationRequest request)
        {
            var specialty = await specialtyRepository.GetSpecialtyByName(request.SpecialtyName);
            if (specialty != null)
            {
                throw new AppException(ErrorCode.SPECIALTY_EXISTED);
            }

            var newSpecialty = new Specialty();
            newSpecialty.SpecialtyName = request.SpecialtyName;
            newSpecialty.Description = request.Description;
            newSpecialty.IsActive = true;

            await specialtyRepository.CreateSpecialty(newSpecialty);

            var countDoctors = await doctorRepository.ToTalDoctorsBySpecialty(newSpecialty.Id);

            return new SpecialtyCreationResponse
            {
                Id = newSpecialty.Id,
                SpecialtyName = newSpecialty.SpecialtyName,
                Description = newSpecialty.Description,
                DoctorNumber = countDoctors,
                PatientNumber = 0
            };
        }

        public async Task DeleteSpecialty(int specialtyId)
        {
            await specialtyRepository.DeleteById(specialtyId);
        }

        public async Task<PageResponse<SpecialtyDetailResponse>> GetAllWithSearch(int page, int size, string? keyword = null)
        {
            var specialties = await specialtyRepository.GetAll(page, size, keyword);
            var totalElements = await specialtyRepository.GetTotalCount(keyword);

            var specialtyResponses = new List<SpecialtyDetailResponse>();

            foreach (var specialty in specialties)
            {
                var doctorCount = await doctorRepository.ToTalDoctorsBySpecialty(specialty.Id);

                var patientCount = await patientRepository.ToTalPatientsBySpecialty(specialty.Id);

                specialtyResponses.Add(new SpecialtyDetailResponse
                {
                    Id = specialty.Id,
                    SpecialtyName = specialty.SpecialtyName,
                    Description = specialty.Description,
                    DoctorNumber = doctorCount,
                    PatientNumber = patientCount
                });
            }

            return new PageResponse<SpecialtyDetailResponse>
            {
                CurrentPages = page,
                PageSizes = size,
                TotalPages = size > 0 ? (int)Math.Ceiling((decimal)totalElements / size) : 0,
                TotalElements = totalElements,
                Items = specialtyResponses
            };
        }

    }
}
