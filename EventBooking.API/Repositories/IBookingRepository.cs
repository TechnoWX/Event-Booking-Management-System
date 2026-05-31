using EventBooking.API.Models;

namespace EventBooking.API.Repositories
{
	public interface IBookingRepository
	{
		Task<IEnumerable<Booking>> GetAllAsync();
		Task<Booking?> GetByIdAsync(int id);
		Task<Booking> CreateAsync(Booking booking);
		Task<Booking?> UpdateAsync(int id, Booking booking);
		Task<bool> DeleteAsync(int id);
	}
}