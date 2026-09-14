namespace Lexi.Models;

public static class BlockType
{
    public const string Learn = "learn";
    public const string Mc = "mc";
    public const string TypeEn = "type_en";
    public const string Fill = "fill";
    public const string Listen = "listen";
    public const string Speak = "speak";

    public static readonly string[] All = { Learn, Mc, TypeEn, Fill, Listen, Speak };
    // Listen/Speak are hidden in the UI for now (coming soon), so they're excluded
    // from the daily/monthly progress totals shown to clients.
    public static readonly string[] Active = { Learn, Mc, TypeEn, Fill };
}

public class DailyBlockActivity
{
    public Guid ClientId { get; set; }
    public string Level { get; set; } = "";
    public DateOnly Date { get; set; }
    public string Block { get; set; } = "";
    public int CompletedCount { get; set; } = 0;
    public int TargetCount { get; set; } = 20;
    public int? LastWordId { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
