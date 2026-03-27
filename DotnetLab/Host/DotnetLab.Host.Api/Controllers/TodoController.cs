using DotnetLab.Host.Api.Models.Todo;
using DotnetLab.Manager.Customer.Contract.Todo;
using DotnetLab.Manager.Customer.Contract.User;
using Microsoft.AspNetCore.Mvc;

namespace DotnetLab.Host.Api.Controllers;

[Route("api/todo")]
[ApiController]
public class TodoController : ControllerBase
{
    private readonly ITodoManager _todoManager;
    private readonly IUserManager _user;
    internal string Email => User.Identity?.Name ?? string.Empty;
    public TodoController(ITodoManager todoManager, IUserManager user)
    {
        _todoManager = todoManager;
        _user = user;
    }

    [HttpPost]
    public async Task<TodoModel> CreateAsync(CreateTodoApiRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            throw new ArgumentException("A title cannot be empty");
        }
        var managerRequest = new CreateTodoRequest(request.UserId, request.Title);
        var result = await _todoManager.CreateAsync(managerRequest);
    
        var model = new TodoModel(result.Id, result.UserId, result.Title, result.Completed);

        return model;
    }

    [HttpGet]
    [Route("{userId}")]
    public async Task<IEnumerable<TodoModel>> GetByUserIdAsync(int userId)
    {
        var items = await _todoManager.GetByUserIdAsync(userId);
        
        return items;
    }

    [HttpPut]
    public async Task<ActionResult<TodoModel>> UpdateAsync(UpdateTodoApiRequest request)
    {
        var model = await _user.GetByEmailAsync(Email);
        var userId = model.Id;
        
        if (userId != request.UserId) return BadRequest("ID mismatch");

        var managerRequest = new UpdateTodoRequest(request.Id, request.UserId, request.Title, request.Completed);
        var result = await _todoManager.UpdateAsync(managerRequest);
    
        return Ok(result);
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var model = await _user.GetByEmailAsync(Email);
        var userId = model.Id;

        _ = await _todoManager.DeleteAsync(userId, id);

        return NoContent();
    }
}