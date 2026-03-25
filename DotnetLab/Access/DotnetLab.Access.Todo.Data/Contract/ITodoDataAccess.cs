using System;

namespace DotnetLab.Access.Todo.Data.Contract;

public interface ITodoDataAccess
{
    Task<bool> CreateAsync(CreateTodoAccessRequest request);
    Task<IEnumerable<TodoAccessModel>> GetByUserIdAsync(int userId);
    Task<TodoAccessModel> UpdateAsync(UpdateTodoAccessRequest request);
    Task<bool> DeleteAsync(int todoId);
}
