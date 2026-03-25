using System;

namespace DotnetLab.Host.Api.Models.Todo;

public class UpdateTodoApiRequest
{
    public required int Id { get; set; }
    public required int UserId { get; set; }
    public required string Title { get; set; }
    public required bool Completed { get; set; }
}
