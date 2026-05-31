using EventBooking.API.DTOs;

namespace EventBooking.API.Services
{
    public interface IEventService
    {
        Task<IEnumerable<EventDTO>> GetAllAsync();
        Task<EventDTO?> GetByIdAsync(int id);
        Task<EventDTO> CreateAsync(CreateEventDTO dto);
        Task<EventDTO?> UpdateAsync(int id, CreateEventDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}