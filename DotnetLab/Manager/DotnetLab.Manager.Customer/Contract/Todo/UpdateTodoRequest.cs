namespace DotnetLab.Manager.Customer.Contract.Todo;

public record UpdateTodoRequest(
    int Id,
    int UserId,
    string Title,
    bool Completed
);