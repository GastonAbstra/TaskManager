namespace DotnetLab.Access.Todo.Data.Contract;

public record UpdateTodoAccessRequest(
    int Id,
    int UserId,
    string Title,
    bool Completed
);
