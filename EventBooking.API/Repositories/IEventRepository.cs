using EventBooking.API.Models;

namespace EventBooking.API.Repositories
{
    public interface IEventRepository
    {
        Task<IEnumerable<Event>> GetAllAsync();
        Task<Event?> GetByIdAsync(int id);
        Task<Event> CreateAsync(Event ev);
        Task<Event?> UpdateAsync(int id, Event ev);
        Task<bool> DeleteAsync(int id);
    }
}