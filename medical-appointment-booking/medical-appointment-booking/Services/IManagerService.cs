using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;

namespace medical_appointment_booking.Services
{
    public interface IManagerService
    {
        Task<IEnumerable<ReceptionistResponse>> GetAllReceptionist();
        Task<ReceptionistResponse?> GetReceptionistById(long id);
        Task<ReceptionistResponse> AddReceptionist(ReceptionistRequest request);
        Task<ReceptionistResponse> UpdateReceptionist(long id, ReceptionistRequest request);
        Task DeleteReceptionist(long id);

    }
}
