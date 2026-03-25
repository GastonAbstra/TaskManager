using System;

namespace DotnetLab.Manager.Customer.Contract.User;

public interface IUserManager
{
    Task<UserModel> CreateAsync(CreateUserRequest request);
    Task<UserModel> GetByEmailAsync(string email);
}
