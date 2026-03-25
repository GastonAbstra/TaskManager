using System;
using System.Text.Json;
using DotnetLab.Access.Common.Domain;
using DotnetLab.Manager.Customer.Contract.User;
using Microsoft.AspNetCore.Identity;

namespace DotnetLab.Manager.Customer;

public class UserManager : IUserManager
{
    private readonly UserManager<User> _userManager;

    public UserManager(UserManager<User> userManager)
    {
        _userManager = userManager;
    }
    public async Task<UserModel> CreateAsync(CreateUserRequest request)
    {
        var user = new User { UserName = request.Email, Email = request.Email, EmailConfirmed = true };

        IdentityResult res = (IdentityResult)await _userManager.CreateAsync(user, request.Password);
        
        if (!res.Succeeded)
        {
            var errorMessages = string.Join(", ", res.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Identity Error: {errorMessages}");
        }
        
        var createdUser = await _userManager.FindByEmailAsync(request.Email);
        return new UserModel(createdUser!.Id, createdUser.Email!);
    }

    public async Task<UserModel> GetByEmailAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);

        return new UserModel(user!.Id, user.Email!);
    }
}
