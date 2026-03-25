using DotnetLab.Access.Common.Domain;
using DotnetLab.Manager.Customer.Contract.User;
using Microsoft.AspNetCore.Identity;
using NSubstitute;

namespace DotnetLab.Manager.Customer.Tests;

[TestFixture]
public class UserManagerTests
{
    private UserManager<User> _identityManagerMock;
    private UserManager _myUserManager;

    [SetUp]
    public void Setup()
    {
        var store = Substitute.For<IUserStore<User>>();
        _identityManagerMock = Substitute.For<UserManager<User>>(
            store, null, null, null, null, null, null, null, null);

        _myUserManager = new UserManager(_identityManagerMock);
    }

    [Test]
    public async Task CreateAsync_ShouldReturnUserModel_WhenIdentitySucceeds()
    {
        var request = new CreateUserRequest("test@ejemplo.com", "Password123!");
        var identityUser = new User { Id = 1, Email = request.Email };

        _identityManagerMock.CreateAsync(Arg.Any<User>(), request.Password)
                            .Returns(Task.FromResult(IdentityResult.Success));

        _identityManagerMock.FindByEmailAsync(request.Email)
                    .Returns(Task.FromResult<User?>(identityUser));

        var result = await _myUserManager.CreateAsync(request);

        Assert.That(result.Email, Is.EqualTo(request.Email));
        Assert.That(result.Id, Is.EqualTo(1));
    }

    [Test]
    public void CreateAsync_WhenIdentityFails_ShouldThrowException()
    {
        var request = new CreateUserRequest("error@test.com", "123"); // Password muy corto
        var identityError = IdentityResult.Failed(new IdentityError { Description = "Password too short" });

        _identityManagerMock.CreateAsync(Arg.Any<User>(), request.Password)
                            .Returns(Task.FromResult(identityError));

        var ex = Assert.ThrowsAsync<InvalidOperationException>(async () => 
            await _myUserManager.CreateAsync(request));

        Assert.That(ex.Message, Does.Contain("Password too short"));
    }

    // Release mock if implements IDisposable
    [TearDown]
    public void TearDown()
    {
        _identityManagerMock?.Dispose();
    }
}