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
    /// True once the client has finished a full daily cycle on a trial
    /// signup (name only, no code) and needs a code to keep going.
    public bool TrialLocked { get; set; } = false;
    /// True once a real one-time code has ever been redeemed for this
    /// client - once true, they're never auto-locked again.
    public bool CodeRedeemed { get; set; } = false;
}
