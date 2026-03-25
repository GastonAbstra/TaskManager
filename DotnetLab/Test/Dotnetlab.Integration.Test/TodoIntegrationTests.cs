using Microsoft.AspNetCore.Mvc.Testing;
using Aspire.Hosting.Testing;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using DotnetLab.Host.Api.Models.Todo;
using System.Net;
using System.Net.Http.Json;

using OrchestratorProject = Projects.DotnetLab_Host_Orchestrator;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;

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

        var connectionString = await _app.GetConnectionStringAsync("Postgres");

        var factory = new WebApplicationFactory<ApiProgram>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseEnvironment("Testing");
                builder.ConfigureAppConfiguration((_, config) =>
                {
                    config.AddInMemoryCollection(new Dictionary<string, string?>
                    {
                        ["ConnectionStrings:Postgres"] = connectionString
                    });
                });

                builder.ConfigureServices(services =>
                {
                    services.AddAuthentication("Test")
                            .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("Test", null);
                });
            });

        _client = factory.CreateClient();
    }

    [Test]
    public async Task CreateTodo_HappyPath_ReturnsCreated()
    {
        
        var request = new CreateTodoApiRequest { UserId = 1, Title = "Test Aspire DB" };
        var response = await _client.PostAsJsonAsync("/api/todo", request);
        Console.WriteLine(await response.Content.ReadAsStringAsync());
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.Created));
    }

    [OneTimeTearDown]
    public async Task TearDown()
    {
        _client?.Dispose();
        if (_app != null) await _app.DisposeAsync();
    }
}