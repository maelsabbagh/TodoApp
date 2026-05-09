using Microsoft.EntityFrameworkCore;
using TodoApp.Data;
using TodoApp.Models.Common;
using TodoApp.Models.Entities;
using TodoApp.Repositories.Interfaces;

namespace TodoApp.Repositories.Implementations
{
    public class TodoRepository: ITodoRepository
    {
        private readonly AppDbContext _context;

        public TodoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<Todo>> GetAllAsync(QueryParameters parameters)
        {
            var query = _context.Todos.AsQueryable();

            if (!string.IsNullOrWhiteSpace(parameters.SearchTerm))
                query = query.Where(t => t.Title.Contains(parameters.SearchTerm) ||
                                         t.Description.Contains(parameters.SearchTerm));

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(t => t.CreatedAt)
                .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                .Take(parameters.PageSize)
                .ToListAsync();

            return new PagedResult<Todo>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = parameters.PageNumber,
                PageSize = parameters.PageSize
            };
        }

        public async Task<Todo?> GetByIdAsync(int id)
        {
            return await _context.Todos.FindAsync(id);
        }

        public async Task<Todo> CreateAsync(Todo todo)
        {
            _context.Todos.Add(todo);
            await _context.SaveChangesAsync();
            return todo;
        }

        public async Task<Todo> UpdateAsync(Todo todo)
        {
            _context.Todos.Update(todo);
            await _context.SaveChangesAsync();
            return todo;
        }

        public async Task DeleteAsync(Todo todo)
        {
            _context.Todos.Remove(todo);
            await _context.SaveChangesAsync();
        }

    }
}
