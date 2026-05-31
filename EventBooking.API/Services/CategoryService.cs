using EventBooking.API.DTOs;
using EventBooking.API.Models;
using EventBooking.API.Repositories;

namespace EventBooking.API.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;

        public CategoryService(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<CategoryDTO>> GetAllAsync()
        {
            var categories = await _repository.GetAllAsync();
            return categories.Select(c => new CategoryDTO
            {
                CategoryId = c.CategoryId,
                Name = c.Name,
                Description = c.Description
            });
        }

        public async Task<CategoryDTO?> GetByIdAsync(int id)
        {
            var category = await _repository.GetByIdAsync(id);
            if (category == null) return null;

            return new CategoryDTO
            {
                CategoryId = category.CategoryId,
                Name = category.Name,
                Description = category.Description
            };
        }

        public async Task<CategoryDTO> CreateAsync(CreateCategoryDTO dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description
            };

            var created = await _repository.CreateAsync(category);
            return new CategoryDTO
            {
                CategoryId = created.CategoryId,
                Name = created.Name,
                Description = created.Description
            };
        }

        public async Task<CategoryDTO?> UpdateAsync(int id, CreateCategoryDTO dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description
            };

            var updated = await _repository.UpdateAsync(id, category);
            if (updated == null) return null;

            return new CategoryDTO
            {
                CategoryId = updated.CategoryId,
                Name = updated.Name,
                Description = updated.Description
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}