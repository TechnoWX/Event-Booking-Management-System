using EventBooking.API.Data;
using EventBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.API.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly EventDBContext _context;

        public CategoryRepository(EventDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _context.Categories.FindAsync(id);
        }

        public async Task<Category> CreateAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<Category?> UpdateAsync(int id, Category category)
        {
            var existing = await _context.Categories.FindAsync(id);
            if (existing == null) return null;

            existing.Name = category.Name;
            existing.Description = category.Description;
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.Categories
                .Include(c => c.Events)
                .FirstOrDefaultAsync(c => c.CategoryId == id);

            if (existing == null) return false;

            if (existing.Events.Any())
                throw new InvalidOperationException("Cannot delete this category as it has associated events.");

            _context.Categories.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}