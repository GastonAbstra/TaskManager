namespace DotnetLab.Manager.Customer.Contract.Todo;

public interface ITodoManager
{
    Task<TodoModel> CreateAsync(CreateTodoRequest request);
    Task<IEnumerable<TodoModel>> GetByUserIdAsync(int userId);
    Task<TodoModel> UpdateAsync(UpdateTodoRequest request);
    Task<int> DeleteAsync(int userId, int todoId);
}
