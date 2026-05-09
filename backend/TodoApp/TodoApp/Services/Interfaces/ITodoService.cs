using TodoApp.Models.Common;
using TodoApp.Models.DTOs;

namespace TodoApp.Services.Interfaces
{
    public interface ITodoService
    {
        Task<PagedResult<TodoResponseDto>> GetAllAsync(QueryParameters parameters);
        Task<TodoResponseDto?> GetByIdAsync(int id);
        Task<TodoResponseDto> CreateAsync(TodoCreateDto dto);
        Task<TodoResponseDto> UpdateAsync(int id, TodoUpdateDto dto);
        Task DeleteAsync(int id);
    }
}
