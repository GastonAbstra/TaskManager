namespace DotnetLab.Manager.Customer.Contract.User;

public record CreateUserRequest(
    string Email,
    string Password
);