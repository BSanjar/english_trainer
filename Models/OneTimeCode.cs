namespace Lexi.Models;

public class OneTimeCode
{
    public int Id { get; set; }
    public string Code { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? UsedAt { get; set; }
    public Guid? UsedByClientId { get; set; }
    public Client? UsedByClient { get; set; }
}
