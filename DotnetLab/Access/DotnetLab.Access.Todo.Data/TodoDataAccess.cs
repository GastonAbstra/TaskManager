using DotnetLab.Access.Common;
using DotnetLab.Access.Common.Domain;
using DotnetLab.Access.Todo.Data.Contract;
using Microsoft.EntityFrameworkCore;

namespace DotnetLab.Access.Todo.Data;

internal class TodoDataAccess : ITodoDataAccess
{
    private readonly DotnetLabDbContext _context;

    public TodoDataAccess(DotnetLabDbContext context)
    {
        _context = context;
    }

    public async Task<bool> CreateAsync(CreateTodoAccessRequest request)
    {
        var entity = new TodoItem
        {
            UserId = request.UserId,
            Title = request.Title,
            Completed = false
        };
        _ = _context.Todo.Add(entity);
        _ = await _context.SaveChangesAsync();

        return true;
    }

    public async Task<IEnumerable<TodoAccessModel>> GetByUserIdAsync(int userId)
    {
        return await _context.Todo
            .AsNoTracking()
            .Where(x => x.UserId == userId) 
            .Select(x => new TodoAccessModel(x.Id, x.UserId, x.Title, x.Completed))
            .ToListAsync();
    }

    public async Task<TodoAccessModel> UpdateAsync(UpdateTodoAccessRequest request)
    {
        var entity = await _context.Todo.SingleAsync(x => x.Id == request.Id);
        entity.Title = request.Title;
        entity.Completed = request.Completed;

        _ = _context.Todo.Update(entity);
        _ = await _context.SaveChangesAsync();
        var model = new TodoAccessModel(entity.Id, entity.UserId, entity.Title, entity.Completed);
        return model;
    }

    public async Task<bool> DeleteAsync(int todoId)
    {
        var entity = await _context.Todo.SingleOrDefaultAsync(x => x.Id == todoId);

        if (entity == null)
        {
            return false;
        }

        _context.Todo.Remove(entity);
        await _context.SaveChangesAsync();
        return true; 
    }
}
