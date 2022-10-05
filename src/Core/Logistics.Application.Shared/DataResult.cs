using System.Text.Json.Serialization;
using Logistics.Application.Shared.Abstractions;

namespace Logistics.Application.Shared;

public class DataResult : IDataResult
{
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string? Error { get; init; }
    public bool Success => string.IsNullOrEmpty(Error);

    public static DataResult CreateSuccess() => new();
    public static DataResult CreateError(string error) => new() { Error = error };
}
    
public class DataResult<T> : DataResult
{
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public T? Value { get; set; }

    public static DataResult<T> CreateSuccess(T result) => new() { Value = result };
    public new static DataResult<T> CreateError(string error) => new() { Error = error };
}