using TodoApp.Models.Common;
using TodoApp.Models.Entities;

namespace TodoApp.Repositories.Interfaces
{
    public interface ITodoRepository
    {
        Task<PagedResult<Todo>> GetAllAsync(QueryParameters parameters);
        Task<Todo?> GetByIdAsync(int id);
        Task<Todo> CreateAsync(Todo todo);
        Task<Todo> UpdateAsync(Todo todo);
        Task DeleteAsync(Todo todo);
    }
}
