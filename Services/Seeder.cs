using System.Text.Json;
using System.Text.Json.Serialization;
using Lexi.Data;
using Lexi.Models;
using Microsoft.EntityFrameworkCore;

namespace Lexi.Services;

public static class Seeder
{
    private record WordSeedDto(
        int Id,
        [property: JsonPropertyName("word")] string Word,
        string Pos,
        string Level,
        string Topic,
        string Ru,
        string Ipa,
        [property: JsonPropertyName("example_en")] string ExampleEn,
        [property: JsonPropertyName("example_ru")] string ExampleRu
    );

    public static async Task SeedAsync(LexiDbContext db, IConfiguration config, IWebHostEnvironment env)
    {
        if (!await db.Words.AnyAsync())
        {
            var path = Path.Combine(env.ContentRootPath, "data", "words.final.json");
            if (File.Exists(path))
            {
                var json = await File.ReadAllTextAsync(path);
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var dtos = JsonSerializer.Deserialize<List<WordSeedDto>>(json, options) ?? new();
                var words = dtos.Select(d => new Word
                {
                    Id = d.Id,
                    WordText = d.Word,
                    Pos = d.Pos,
                    Level = d.Level,
                    Topic = d.Topic,
                    Ru = d.Ru,
                    Ipa = d.Ipa,
                    ExampleEn = d.ExampleEn,
                    ExampleRu = d.ExampleRu,
                }).ToList();
                await db.Words.AddRangeAsync(words);
                await db.SaveChangesAsync();
            }
        }

        if (!await db.AdminUsers.AnyAsync())
        {
            var username = config["Admin:Username"] ?? Environment.GetEnvironmentVariable("ADMIN_USERNAME") ?? "admin";
            var password = config["Admin:Password"] ?? Environment.GetEnvironmentVariable("ADMIN_PASSWORD") ?? "lexi-admin-change-me";
            db.AdminUsers.Add(new AdminUser
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            });
            await db.SaveChangesAsync();
        }
    }
}
