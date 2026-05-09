using System.ComponentModel.DataAnnotations;
using TodoApp.Models.Entities;

namespace TodoApp.Models.DTOs
{
    public class TodoCreateDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public TodoPriority Priority { get; set; } = TodoPriority.Medium;
    }
}
