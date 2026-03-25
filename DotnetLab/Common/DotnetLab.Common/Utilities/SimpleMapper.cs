using System.Reflection;

namespace DotnetLab.Common.Utilities;
public static class SimpleMapper
{
    public static TTarget Map<TSource, TTarget>(TSource source) where TTarget : class
    {
        ArgumentNullException.ThrowIfNull(source);

        var targetType = typeof(TTarget);
        var sourceType = typeof(TSource);

        // Get the primary constructor of the record
        var constructor = targetType.GetConstructors().FirstOrDefault();
        if (constructor is null)
        {
            throw new InvalidOperationException($"No public constructor found for {targetType.Name}");
        }

        var sourceProperties = sourceType.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                 .Where(p => p.CanRead)
                                 .ToDictionary(p => p.Name, p => p);

        var parameterValues = constructor.GetParameters().Select(param =>
        {
            if (sourceProperties.TryGetValue(param.Name!, out var sourceProperty) &&
                sourceProperty.PropertyType == param.ParameterType)
            {
                return sourceProperty.GetValue(source);
            }

            // Use default value if no match is found
            return GetDefaultValue(param.ParameterType);
        }).ToArray();

        return (TTarget)constructor.Invoke(parameterValues);
    }

    public static TTarget ToRecord<TTarget>(this object source) where TTarget : class
    {
        ArgumentNullException.ThrowIfNull(source);

        var targetType = typeof(TTarget);
        var sourceType = source.GetType();

        var constructor = targetType.GetConstructors().FirstOrDefault();
        if (constructor is null)
        {
            throw new InvalidOperationException($"No public constructor found for {targetType.Name}");
        }

        var sourceProperties = sourceType.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                         .Where(p => p.CanRead)
                                         .ToDictionary(p => p.Name, p => p);

        var parameterValues = constructor.GetParameters().Select(param =>
        {
            var targetContainsProperty = sourceProperties.TryGetValue(param.Name!, out var prop);
            var propertyTypeMatches = false;
            if (targetContainsProperty)
            {
                var propValue = prop!.GetValue(source);
                var sourceTypeNonNullable = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;
                propertyTypeMatches = sourceTypeNonNullable == param.ParameterType;

                if (propertyTypeMatches)
                {
                    return propValue;
                }
            }
            throw new InvalidOperationException($"The parameter {param.Name} does not exist in the source {sourceType}");
        }).ToArray();

        return (TTarget)constructor.Invoke(parameterValues);
    }

    private static object? GetDefaultValue(Type type)
    {
        return type.IsValueType ? Activator.CreateInstance(type) : null;
    }
}