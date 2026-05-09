using System.ComponentModel.DataAnnotations;
using TodoApp.Models.Entities;

namespace TodoApp.Models.DTOs
{
    public class TodoUpdateDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public bool IsCompleted { get; set; }

        public TodoPriority Priority { get; set; } = TodoPriority.Medium;
    }
}
