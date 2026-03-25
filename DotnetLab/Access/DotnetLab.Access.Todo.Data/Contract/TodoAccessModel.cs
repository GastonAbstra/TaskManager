namespace DotnetLab.Access.Todo.Data.Contract;

public record class TodoAccessModel(
    int Id,
    int UserId,
    string Title,
    bool Completed
);