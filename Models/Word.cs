namespace Lexi.Models;

public class Word
{
    public int Id { get; set; }
    public string WordText { get; set; } = "";
    public string Pos { get; set; } = "n";
    public string Level { get; set; } = "A1";
    public string Topic { get; set; } = "core";
    public string Ru { get; set; } = "";
    public string Ipa { get; set; } = "";
    public string ExampleEn { get; set; } = "";
    public string ExampleRu { get; set; } = "";
}
