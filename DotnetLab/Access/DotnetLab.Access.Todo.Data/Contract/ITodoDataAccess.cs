using System;

namespace DotnetLab.Access.Todo.Data.Contract;

public interface ITodoDataAccess
{
    Task<TodoAccessModel> CreateAsync(CreateTodoAccessRequest request);
    Task<IEnumerable<TodoAccessModel>> GetByUserIdAsync(int userId);
    Task<TodoAccessModel> GetByIdAsync(int id);
    Task<TodoAccessModel> UpdateAsync(UpdateTodoAccessRequest request);
    Task<int> DeleteAsync(int todoId);
}
