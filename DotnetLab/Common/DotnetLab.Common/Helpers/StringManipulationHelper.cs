using System.Text.RegularExpressions;

namespace DotnetLab.Common.Helpers;
internal class StringManipulationHelper : IStringManipulationHelper
{
    public IEnumerable<string> ExtractTextBetweenDelimeters(string input, params (char open, char close)[] delimiters)
    {
        var results = new List<string>();

        foreach (var (open, close) in delimiters)
        {
            var escapedOpen = Regex.Escape(open.ToString());
            var escapedClose = Regex.Escape(close.ToString());
            var pattern = $@"{escapedOpen}(.*?){escapedClose}";
            var matches = Regex.Matches(input, pattern);
            foreach (Match match in matches)
            {
                results.Add(match.Groups[1].Value);
            }
        }

        return results;
    }
}