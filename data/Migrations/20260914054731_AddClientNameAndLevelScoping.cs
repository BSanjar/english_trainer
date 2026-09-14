using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lexi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddClientNameAndLevelScoping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_client_daily_block_activity",
                table: "client_daily_block_activity");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "clients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Level",
                table: "client_daily_block_activity",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_client_daily_block_activity",
                table: "client_daily_block_activity",
                columns: new[] { "ClientId", "Level", "Date", "Block" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_client_daily_block_activity",
                table: "client_daily_block_activity");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "clients");

            migrationBuilder.DropColumn(
                name: "Level",
                table: "client_daily_block_activity");

            migrationBuilder.AddPrimaryKey(
                name: "PK_client_daily_block_activity",
                table: "client_daily_block_activity",
                columns: new[] { "ClientId", "Date", "Block" });
        }
    }
}
