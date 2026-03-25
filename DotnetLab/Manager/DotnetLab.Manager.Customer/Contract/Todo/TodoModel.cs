namespace DotnetLab.Manager.Customer.Contract.Todo;

public record TodoModel(
    int Id,
    int UserId,
    string Title,
    bool Completed
);