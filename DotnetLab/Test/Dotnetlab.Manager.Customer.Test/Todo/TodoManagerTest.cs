using DotnetLab.Access.Todo.Data.Contract;
using DotnetLab.Manager.Customer.Contract.Todo;
using NSubstitute;

namespace DotnetLab.Manager.Customer.Tests;

[TestFixture]
public class TodoManagerTests
{
    private ITodoDataAccess _todoDataAccessMock;
    private TodoManager _todoManager;

    [SetUp]
    public void Setup()
    {
        _todoDataAccessMock = Substitute.For<ITodoDataAccess>();
        
        _todoManager = new TodoManager(_todoDataAccessMock);
    }

    [Test]
    public async Task CreateAsync_ShouldReturnTrue_WhenAccessSucceeds()
    {
        var request = new CreateTodoRequest(1, "Task 1");
        
        _todoDataAccessMock.CreateAsync(Arg.Any<CreateTodoAccessRequest>())
                           .Returns(Task.FromResult(true));

        var result = await _todoManager.CreateAsync(request);

        Assert.That(result, Is.True);
        
        await _todoDataAccessMock.Received(1).CreateAsync(Arg.Is<CreateTodoAccessRequest>(x => 
            x.UserId == request.UserId && 
            x.Title == request.Title));
    }

    [Test]
    public async Task GetByUserIdAsync_ShouldMapAccessModelsToTodoModels()
    {
        int userId = 10;
        var accessData = new List<TodoAccessModel> 
        { 
            new TodoAccessModel(1, userId, "Task 1", false),
            new TodoAccessModel(2, userId, "Task 2", true)
        };

        _todoDataAccessMock.GetByUserIdAsync(userId)
                           .Returns(Task.FromResult((IEnumerable<TodoAccessModel>)accessData));

        var result = (await _todoManager.GetByUserIdAsync(userId)).ToList();

        Assert.That(result.Count, Is.EqualTo(2));
        Assert.That(result[0].Title, Is.EqualTo("Task 1"));
        Assert.That(result[1].Completed, Is.True);
    }

    [Test]
    public void CreateAsync_WhenTitleIsEmpty_ShouldThrowArgumentException()
    {
        var request = new CreateTodoRequest(1, "");

        var ex = Assert.ThrowsAsync<ArgumentException>(async () => 
            await _todoManager.CreateAsync(request));
        
        Assert.That(ex.Message, Is.EqualTo("A task title cannot be empty"));
    }

    [Test]
    public async Task DeleteAsync_WhenUserOwnsTodo_ShouldReturnTrue()
    {
        int userId = 1;
        int todoIdToDelete = 10;
        var userTasks = new List<TodoAccessModel> 
        { 
            new TodoAccessModel(todoIdToDelete, userId, "Task 1", false) 
        };

        _todoDataAccessMock.GetByUserIdAsync(userId).Returns(userTasks);
        _todoDataAccessMock.DeleteAsync(todoIdToDelete).Returns(true);

        var result = await _todoManager.DeleteAsync(userId, todoIdToDelete);

        Assert.That(result, Is.True);
        await _todoDataAccessMock.Received(1).DeleteAsync(todoIdToDelete);
    }

    [Test]
    public async Task DeleteAsync_WhenUserDoesNotOwnTodo_ShouldReturnFalseAndNotCallDelete()
    {
        int userId = 1;
        int maliciousTodoId = 999;
        var userTasks = new List<TodoAccessModel> 
        { 
            new TodoAccessModel(10, userId, "My unique task :(", false) 
        };

        _todoDataAccessMock.GetByUserIdAsync(userId).Returns(userTasks);

        var result = await _todoManager.DeleteAsync(userId, maliciousTodoId);

        Assert.That(result, Is.False);
        await _todoDataAccessMock.DidNotReceive().DeleteAsync(Arg.Any<int>());
    }
}