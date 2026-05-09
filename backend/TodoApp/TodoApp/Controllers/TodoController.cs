using Microsoft.AspNetCore.Mvc;
using TodoApp.Models.Common;
using TodoApp.Models.DTOs;
using TodoApp.Services.Interfaces;

namespace TodoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : Controller
    {
        private readonly ITodoService _todoService;

        public TodoController(ITodoService todoService)
        {
            _todoService = todoService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<TodoResponseDto>>> GetAll([FromQuery] QueryParameters parameters)
        {
            var result = await _todoService.GetAllAsync(parameters);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TodoResponseDto>> GetById(int id)
        {
            var todo = await _todoService.GetByIdAsync(id);
            if (todo is null)
                return NotFound();

            return Ok(todo);
        }

        [HttpPost]
        public async Task<ActionResult<TodoResponseDto>> Create([FromBody] TodoCreateDto dto)
        {
            var created = await _todoService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TodoResponseDto>> Update(int id, [FromBody] TodoUpdateDto dto)
        {
            var updated = await _todoService.UpdateAsync(id, dto);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _todoService.DeleteAsync(id);
            return NoContent();
        }
    }
}
