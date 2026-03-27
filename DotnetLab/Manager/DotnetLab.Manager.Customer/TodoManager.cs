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

    public async Task<TodoModel> CreateAsync(CreateTodoRequest request)
    {
        var accessRequest = new CreateTodoAccessRequest(request.UserId, request.Title);
        var accessModel = await _todoDataAccess.CreateAsync(accessRequest);
        return new TodoModel(accessModel.Id, accessModel.UserId, accessModel.Title, accessModel.Completed);
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

    public async Task<int> DeleteAsync(int userId, int todoId)
    {
        var todosOwnedByUser = await _todoDataAccess.GetByIdAsync(todoId);

        if (todosOwnedByUser.UserId != userId)
        {
            throw new UnauthorizedAccessException("Delete operation found an exception: You don't have permission to delete this task");
        }
        return await _todoDataAccess.DeleteAsync(todoId);
    }
}