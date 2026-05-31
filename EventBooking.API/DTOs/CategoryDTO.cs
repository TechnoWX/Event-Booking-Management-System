using System.ComponentModel.DataAnnotations;

namespace EventBooking.API.DTOs
{
    public class CategoryDTO
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class CreateCategoryDTO
    {
        [Required]
        [MinLength(2, ErrorMessage = "Name must be at least 2 characters.")]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}