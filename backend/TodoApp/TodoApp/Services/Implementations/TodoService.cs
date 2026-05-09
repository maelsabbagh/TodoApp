using TodoApp.Models.Common;
using TodoApp.Models.DTOs;
using TodoApp.Models.Entities;
using TodoApp.Repositories.Interfaces;
using TodoApp.Services.Interfaces;

namespace TodoApp.Services.Implementations
{
    public class TodoService: ITodoService
    {
        private readonly ITodoRepository _todoRepository;

        public TodoService(ITodoRepository todoRepository)
        {
            _todoRepository = todoRepository;
        }

        public async Task<PagedResult<TodoResponseDto>> GetAllAsync(QueryParameters parameters)
        {
            var pagedTodos = await _todoRepository.GetAllAsync(parameters);

            return new PagedResult<TodoResponseDto>
            {
                Items = pagedTodos.Items.Select(MapToResponseDto),
                TotalCount = pagedTodos.TotalCount,
                PageNumber = pagedTodos.PageNumber,
                PageSize = pagedTodos.PageSize
            };
        }

        public async Task<TodoResponseDto?> GetByIdAsync(int id)
        {
            var todo = await _todoRepository.GetByIdAsync(id);
            return todo is null ? null : MapToResponseDto(todo);
        }

        public async Task<TodoResponseDto> CreateAsync(TodoCreateDto dto)
        {
            var todo = new Todo
            {
                Title = dto.Title,
                Description = dto.Description,
                Priority = dto.Priority
            };

            var created = await _todoRepository.CreateAsync(todo);
            return MapToResponseDto(created);
        }

        public async Task<TodoResponseDto> UpdateAsync(int id, TodoUpdateDto dto)
        {
            var todo = await _todoRepository.GetByIdAsync(id);
            if (todo is null)
                throw new KeyNotFoundException($"Todo with id {id} was not found.");

            todo.Title = dto.Title;
            todo.Description = dto.Description;
            todo.IsCompleted = dto.IsCompleted;
            todo.Priority = dto.Priority;
            todo.UpdatedAt = DateTime.UtcNow;

            var updated = await _todoRepository.UpdateAsync(todo);
            return MapToResponseDto(updated);
        }

        public async Task DeleteAsync(int id)
        {
            var todo = await _todoRepository.GetByIdAsync(id);
            if (todo is null)
                throw new KeyNotFoundException($"Todo with id {id} was not found.");

            await _todoRepository.DeleteAsync(todo);
        }

        private static TodoResponseDto MapToResponseDto(Todo todo)
        {
            return new TodoResponseDto
            {
                Id = todo.Id,
                Title = todo.Title,
                Description = todo.Description,
                IsCompleted = todo.IsCompleted,
                Priority = todo.Priority.ToString(),
                CreatedAt = todo.CreatedAt
            };
        }
    }
}
