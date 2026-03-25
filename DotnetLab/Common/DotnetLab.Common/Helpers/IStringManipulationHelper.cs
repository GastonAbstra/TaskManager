namespace DotnetLab.Common.Helpers;
public interface IStringManipulationHelper
{
    IEnumerable<string> ExtractTextBetweenDelimeters(string text, params (char open, char close)[] delimiters);
}