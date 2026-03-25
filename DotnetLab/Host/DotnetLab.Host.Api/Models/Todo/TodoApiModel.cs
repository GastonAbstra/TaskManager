namespace DotnetLab.Host.Api.Models.Todo;

public record TodoApiModel(
    int Id,
    int UserId,
    string Title,
    bool Completed
);