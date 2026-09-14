namespace Lexi.Models;

public class Client
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid DeviceToken { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = "";
    public string? Level { get; set; }
    public int DailyGoal { get; set; } = 20;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastSeenAt { get; set; } = DateTime.UtcNow;
}
