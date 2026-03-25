namespace DotnetLab.Manager.Customer.Contract.Todo;

public record CreateTodoRequest(
    int UserId,
    string Title
);
