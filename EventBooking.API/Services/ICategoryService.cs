using EventBooking.API.DTOs;

namespace EventBooking.API.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDTO>> GetAllAsync();
        Task<CategoryDTO?> GetByIdAsync(int id);
        Task<CategoryDTO> CreateAsync(CreateCategoryDTO dto);
        Task<CategoryDTO?> UpdateAsync(int id, CreateCategoryDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}