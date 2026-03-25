using System.Text.Json;
using DotnetLab.Host.Api.Models.User;
using DotnetLab.Manager.Customer.Contract.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotnetLab.Host.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserManager _user;
    internal string Email => User.Identity?.Name ?? string.Empty;
    public UserController(IUserManager user)
    {
        _user = user;
    }

    [HttpPost]
    public async Task<UserModel> CreateAsync([FromBody] CreateUserApiRequest request)
    {
        var user = new CreateUserRequest(
            request.Email,
            request.Password
        );
        
        var model = await _user.CreateAsync(user);
        return model;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<UserApiModel> Me()
    {
        string contentEmail = JsonSerializer.Serialize(Email, new JsonSerializerOptions { WriteIndented = true });
        Console.WriteLine("The method Me is performing: ");
        Console.WriteLine(contentEmail);

        var model = await _user.GetByEmailAsync(Email);
        
        Console.WriteLine("GetByEmailAsync: ");
        string modelResponse = JsonSerializer.Serialize(model, new JsonSerializerOptions { WriteIndented = true });
        Console.WriteLine(modelResponse);

        var apiModel = new UserApiModel(model.Id, model.Email);
        return apiModel;
    }
}

