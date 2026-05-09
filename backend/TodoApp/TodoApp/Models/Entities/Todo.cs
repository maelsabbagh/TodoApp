using System.ComponentModel.DataAnnotations;

namespace TodoApp.Models.Entities
{
    public class Todo
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public bool IsCompleted { get; set; } = false;
        public TodoPriority Priority { get; set; } = TodoPriority.Medium;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
