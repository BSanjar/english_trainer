using System.Security.Claims;
using Lexi.Data;
using Lexi.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lexi.Controllers;

public record AdminLoginRequest(string Username, string Password);
public record CodeDto(string Code, DateTime CreatedAt, DateTime ExpiresAt, DateTime? UsedAt);

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly LexiDbContext _db;
    public AdminController(LexiDbContext db) { _db = db; }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AdminLoginRequest req)
    {
        var admin = await _db.AdminUsers.FirstOrDefaultAsync(a => a.Username == req.Username);
        if (admin == null || !BCrypt.Net.BCrypt.Verify(req.Password, admin.PasswordHash))
            return Unauthorized(new { error = "invalid_credentials" });

        var claims = new[] { new Claim(ClaimTypes.Name, admin.Username), new Claim("adminId", admin.Id.ToString()) };
        var identity = new ClaimsIdentity(claims, "AdminCookie");
        await HttpContext.SignInAsync("AdminCookie", new ClaimsPrincipal(identity), new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc = DateTimeOffset.UtcNow.AddDays(30),
        });
        return Ok(new { username = admin.Username });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync("AdminCookie");
        return Ok();
    }

    [HttpGet("me")]
    [Authorize(AuthenticationSchemes = "AdminCookie")]
    public IActionResult Me() => Ok(new { username = User.Identity?.Name });

    [HttpPost("codes")]
    [Authorize(AuthenticationSchemes = "AdminCookie")]
    public async Task<IActionResult> GenerateCode()
    {
        string code;
        var rnd = Random.Shared;
        do
        {
            code = rnd.Next(0, 1_000_000).ToString("D6");
        } while (await _db.OneTimeCodes.AnyAsync(c => c.Code == code && c.UsedAt == null && c.ExpiresAt > DateTime.UtcNow));

        var otc = new OneTimeCode
        {
            Code = code,
            ExpiresAt = DateTime.UtcNow.AddMinutes(30),
        };
        _db.OneTimeCodes.Add(otc);
        await _db.SaveChangesAsync();

        return Ok(new CodeDto(otc.Code, otc.CreatedAt, otc.ExpiresAt, otc.UsedAt));
    }

    [HttpGet("codes")]
    [Authorize(AuthenticationSchemes = "AdminCookie")]
    public async Task<IActionResult> ListCodes()
    {
        var codes = await _db.OneTimeCodes
            .OrderByDescending(c => c.CreatedAt)
            .Take(30)
            .Select(c => new CodeDto(c.Code, c.CreatedAt, c.ExpiresAt, c.UsedAt))
            .ToListAsync();
        return Ok(codes);
    }
}
