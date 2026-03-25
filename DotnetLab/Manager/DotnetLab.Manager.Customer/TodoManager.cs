using DotnetLab.Access.Todo.Data.Contract;
using DotnetLab.Manager.Customer.Contract.Todo;

namespace DotnetLab.Manager.Customer;

internal class TodoManager : ITodoManager
{
    private readonly ITodoDataAccess _todoDataAccess;

    public TodoManager(ITodoDataAccess todoDataAccess)
    {
        _todoDataAccess = todoDataAccess;
    }

    public async Task<bool> CreateAsync(CreateTodoRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            throw new ArgumentException("A task title cannot be empty");

        var accesRequest = new CreateTodoAccessRequest(request.UserId, request.Title);
        return await _todoDataAccess.CreateAsync(accesRequest);
    }
    
    public async Task<IEnumerable<TodoModel>> GetByUserIdAsync(int userId)
    {
        var accessModels = await _todoDataAccess.GetByUserIdAsync(userId);
        return accessModels.Select(x => new TodoModel(x.Id, x.UserId, x.Title, x.Completed));
    }
    
    public async Task<TodoModel> UpdateAsync(UpdateTodoRequest request)
    {
        var accessRequest = new UpdateTodoAccessRequest(request.Id, request.UserId, request.Title, request.Completed);
        var accessModel = await _todoDataAccess.UpdateAsync(accessRequest);
        
        return new TodoModel(accessModel.Id, accessModel.UserId, accessModel.Title, accessModel.Completed);
    }

    public async Task<bool> DeleteAsync(int userId, int todoId)
    {
        var todosOwnedByUser = await _todoDataAccess.GetByUserIdAsync(userId);

        if (todosOwnedByUser.Any(t => t.Id == todoId))
        {
            var success = await _todoDataAccess.DeleteAsync(todoId);
            return success;
        }

        return false;
    }
}