namespace DotnetLab.Common.Utilities;

public static class Result
{
    public static Result<T> Success<T>(T value) => new(value, Array.Empty<string>());
    public static Result<T> Failure<T>(string errorMessage) => new(default, new[] { errorMessage });
    public static Result<T> Failure<T>(IEnumerable<string> errors) => new(default, errors);
}

public class Result<T>
{
    public T? Value { get; }
    public bool IsSuccess { get; }
    public IEnumerable<string> Errors { get; }

    protected internal Result(T? value, IEnumerable<string> errors)
    {
        Value = value;
        IsSuccess = !errors.Any();
        Errors = errors ?? Array.Empty<string>();
    }
}