using Aspire.Hosting.Testing;
using DotnetLab.Host.Api.Models.Todo;
using DotnetLab.Host.Api.Models.User;
using System.Net;
using System.Net.Http.Json;

using OrchestratorProject = Projects.DotnetLab_Host_Orchestrator;

namespace DotnetLab.Manager.Customer.Tests.Integration;

[TestFixture]
public class TodoIntegrationTests
{
    private DistributedApplication _app;
    private HttpClient _client;

    [OneTimeSetUp]
    public async Task Setup()
    {
        var appHost = await DistributedApplicationTestingBuilder
            .CreateAsync<OrchestratorProject>();

        _app = await appHost.BuildAsync();
        await _app.StartAsync();

        // Aquí inicializamos el HttpClient apuntando al API
        _client = _app.CreateHttpClient("dotnetlab-host-api");
    }

    [Test]

    

    public async Task CreateTodo_HappyPath_ReturnsCreated()
    {
        var registerRequest = new CreateUserApiRequest 
        { 
            Email = "testuser@example.com", 
            Password = "Pass123$"
        };

        var registerResponse = await _client.PostAsJsonAsync("/api/user", registerRequest);
        registerResponse.EnsureSuccessStatusCode();

        var createdUser = await registerResponse.Content.ReadFromJsonAsync<UserApiModel>();

        var todoRequest = new CreateTodoApiRequest { UserId = createdUser?.Id ?? 1, Title = "Test Aspire DB" };
        var todoResponse = await _client.PostAsJsonAsync("/api/todo", todoRequest);

        Assert.That(todoResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));


        var request = new CreateTodoApiRequest { UserId = 1, Title = "Test Aspire DB" };
        var response = await _client.PostAsJsonAsync("/api/todo", request);

        Console.WriteLine(await response.Content.ReadAsStringAsync());
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
    }

    [OneTimeTearDown]
    public async Task TearDown()
    {
        _client?.Dispose();
        if (_app != null) await _app.DisposeAsync();
    }
}