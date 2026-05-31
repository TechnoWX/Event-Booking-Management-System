using EventBooking.API.DTOs;
using EventBooking.API.Models;
using EventBooking.API.Repositories;

namespace EventBooking.API.Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _repository;

        public EventService(IEventRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<EventDTO>> GetAllAsync()
        {
            var events = await _repository.GetAllAsync();
            return events.Select(e => new EventDTO
            {
                EventId = e.EventId,
                CategoryId = e.CategoryId,
                CategoryName = e.Category?.Name ?? string.Empty,
                Title = e.Title,
                Description = e.Description,
                Location = e.Location,
                EventDate = e.EventDate,
                MaxParticipants = e.MaxParticipants,
                BookedCount = e.Bookings.Count(b => b.Status == "Confirmed"),
                CreatedAt = e.CreatedAt
            });
        }

        public async Task<EventDTO?> GetByIdAsync(int id)
        {
            var e = await _repository.GetByIdAsync(id);
            if (e == null) return null;

            return new EventDTO
            {
                EventId = e.EventId,
                CategoryId = e.CategoryId,
                CategoryName = e.Category?.Name ?? string.Empty,
                Title = e.Title,
                Description = e.Description,
                Location = e.Location,
                EventDate = e.EventDate,
                MaxParticipants = e.MaxParticipants,
                BookedCount = e.Bookings.Count(b => b.Status == "Confirmed"),
                CreatedAt = e.CreatedAt
            };
        }

        public async Task<EventDTO> CreateAsync(CreateEventDTO dto)
        {
            var ev = new Event
            {
                CategoryId = dto.CategoryId,
                Title = dto.Title,
                Description = dto.Description,
                Location = dto.Location,
                EventDate = dto.EventDate,
                MaxParticipants = dto.MaxParticipants
            };

            var created = await _repository.CreateAsync(ev);
            return await GetByIdAsync(created.EventId) ?? new EventDTO();
        }

        public async Task<EventDTO?> UpdateAsync(int id, CreateEventDTO dto)
        {
            var ev = new Event
            {
                CategoryId = dto.CategoryId,
                Title = dto.Title,
                Description = dto.Description,
                Location = dto.Location,
                EventDate = dto.EventDate,
                MaxParticipants = dto.MaxParticipants
            };

            var updated = await _repository.UpdateAsync(id, ev);
            if (updated == null) return null;

            return await GetByIdAsync(updated.EventId);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}