using System.Text.Json;
using DotnetLab.Host.Api.Models.Todo;
using DotnetLab.Manager.Customer.Contract.Todo;
using DotnetLab.Manager.Customer.Contract.User;
using Microsoft.AspNetCore.Mvc;

namespace DotnetLab.Host.Api.Controllers;

[Route("api/[controller]")]
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
    public async Task<IActionResult> CreateAsync(CreateTodoApiRequest request)
    {
        var managerRequest = new CreateTodoRequest(request.UserId, request.Title);
        var success = await _todoManager.CreateAsync(managerRequest);
    
        return success ? StatusCode(201) : BadRequest();
    }

    [HttpGet("{userId:int}")]
    public async Task<ActionResult<IEnumerable<TodoModel>>> GetByUserIdAsync(int userId)
    {
        var items = await _todoManager.GetByUserIdAsync(userId);
        
        return Ok(items);
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

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var model = await _user.GetByEmailAsync(Email);
        var userId = model.Id;

        var success = await _todoManager.DeleteAsync(userId, id);
        
        if (!success) return NotFound();

        return NoContent();
    }
}