using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;

namespace medical_appointment_booking.Services.Impl
{
    public class SpecialtyService : ISpecialtyService
    {

        private readonly SpecialtyRepository specialtyRepository;

        public SpecialtyService(SpecialtyRepository specialtyRepository)
        {
            this.specialtyRepository = specialtyRepository;
        }

        public async Task<Specialty> Creation(SpecialtyCreationRequest request)
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

            return new Specialty
            {
                Id = newSpecialty.Id,
                SpecialtyName = newSpecialty.SpecialtyName,
                Description = newSpecialty.Description,
                CreatedAt = newSpecialty.CreatedAt,
            };

        }
    }
}
