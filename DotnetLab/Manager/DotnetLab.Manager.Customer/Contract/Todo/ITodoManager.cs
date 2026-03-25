namespace DotnetLab.Manager.Customer.Contract.Todo;

public interface ITodoManager
{
    Task<bool> CreateAsync(CreateTodoRequest request);
    Task<IEnumerable<TodoModel>> GetByUserIdAsync(int userId);
    Task<TodoModel> UpdateAsync(UpdateTodoRequest request);
    Task<bool> DeleteAsync(int userId, int todoId);
}
