using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeslaACDC.Data.Migrations
{
    /// <inheritdoc />
    public partial class CampoUrlReproduccion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "url",
                table: "audiolibro",
                newName: "url_reproducción");

            migrationBuilder.AddColumn<string>(
                name: "url_descarga",
                table: "audiolibro",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "url_descarga",
                table: "audiolibro");

            migrationBuilder.RenameColumn(
                name: "url_reproducción",
                table: "audiolibro",
                newName: "url");
        }
    }
}
