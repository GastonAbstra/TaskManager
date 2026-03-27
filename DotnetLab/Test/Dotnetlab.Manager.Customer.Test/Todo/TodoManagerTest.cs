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
    public async Task CreateAsync_ShouldReturnTodoModel_WhenAccessSucceeds()
    {
        // Arrange
        var request = new CreateTodoRequest(1, "Task 1");

        var accessResponse = new TodoAccessModel(
            Id: 10,
            UserId: request.UserId,
            Title: request.Title,
            Completed: false
        );

        _todoDataAccessMock.CreateAsync(Arg.Any<CreateTodoAccessRequest>())
                        .Returns(Task.FromResult(accessResponse));

        // Act
        var result = await _todoManager.CreateAsync(request);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Id, Is.EqualTo(accessResponse.Id));
        Assert.That(result.UserId, Is.EqualTo(accessResponse.UserId));
        Assert.That(result.Title, Is.EqualTo(accessResponse.Title));
        Assert.That(result.Completed, Is.EqualTo(accessResponse.Completed));

        await _todoDataAccessMock.Received(1).CreateAsync(
            Arg.Is<CreateTodoAccessRequest>(x =>
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
    public async Task DeleteAsync_ShouldReturnTodoId()
    {
        int userId = 1;
        int todoIdToDelete = 10;
        var userTasks = new List<TodoAccessModel> 
        { 
            new TodoAccessModel(todoIdToDelete, userId, "Task 1", false) 
        };

        _todoDataAccessMock.GetByUserIdAsync(userId).Returns(userTasks);
        _todoDataAccessMock.DeleteAsync(todoIdToDelete).Returns(todoIdToDelete);

        var actual = await _todoManager.DeleteAsync(userId, todoIdToDelete);

        Assert.That(actual, Is.EqualTo(todoIdToDelete));
    }
}