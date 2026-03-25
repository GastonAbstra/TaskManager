namespace DotnetLab.Access.Todo.Data.Contract;

public record CreateTodoAccessRequest(
    int UserId,
    string Title
);

