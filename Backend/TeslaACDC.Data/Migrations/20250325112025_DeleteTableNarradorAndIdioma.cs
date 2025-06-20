using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TeslaACDC.Data.Migrations
{
    /// <inheritdoc />
    public partial class DeleteTableNarradorAndIdioma : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_audiolibro_idioma_idioma_id",
                table: "audiolibro");

            migrationBuilder.DropForeignKey(
                name: "FK_audiolibro_narrador_narrador_id",
                table: "audiolibro");

            migrationBuilder.DropForeignKey(
                name: "FK_autor_idioma_idioma_id",
                table: "autor");

            migrationBuilder.DropForeignKey(
                name: "FK_libro_idioma_idioma_id",
                table: "libro");

            migrationBuilder.DropTable(
                name: "idioma");

            migrationBuilder.DropTable(
                name: "narrador");

            migrationBuilder.DropIndex(
                name: "IX_libro_idioma_id",
                table: "libro");

            migrationBuilder.DropIndex(
                name: "IX_autor_idioma_id",
                table: "autor");

            migrationBuilder.DropIndex(
                name: "IX_audiolibro_idioma_id",
                table: "audiolibro");

            migrationBuilder.DropIndex(
                name: "IX_audiolibro_narrador_id",
                table: "audiolibro");

            migrationBuilder.DropColumn(
                name: "idioma_id",
                table: "libro");

            migrationBuilder.DropColumn(
                name: "idioma_id",
                table: "autor");

            migrationBuilder.DropColumn(
                name: "idioma_id",
                table: "audiolibro");

            migrationBuilder.DropColumn(
                name: "narrador_id",
                table: "audiolibro");

            migrationBuilder.AlterColumn<string>(
                name: "portada",
                table: "libro",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "idioma",
                table: "libro",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "idioma",
                table: "autor",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "tamaño_m_b",
                table: "audiolibro",
                type: "text",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AddColumn<string>(
                name: "idioma",
                table: "audiolibro",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "narrador",
                table: "audiolibro",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "idioma",
                table: "libro");

            migrationBuilder.DropColumn(
                name: "idioma",
                table: "autor");

            migrationBuilder.DropColumn(
                name: "idioma",
                table: "audiolibro");

            migrationBuilder.DropColumn(
                name: "narrador",
                table: "audiolibro");

            migrationBuilder.AlterColumn<string>(
                name: "portada",
                table: "libro",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "idioma_id",
                table: "libro",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "idioma_id",
                table: "autor",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<double>(
                name: "tamaño_m_b",
                table: "audiolibro",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(
                name: "idioma_id",
                table: "audiolibro",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "narrador_id",
                table: "audiolibro",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "idioma",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_idioma", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "narrador",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    apellidos = table.Column<string>(type: "text", nullable: false),
                    fecha_nacimiento = table.Column<DateOnly>(type: "date", nullable: true),
                    nacionalidad = table.Column<string>(type: "text", nullable: false),
                    nombre = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_narrador", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_libro_idioma_id",
                table: "libro",
                column: "idioma_id");

            migrationBuilder.CreateIndex(
                name: "IX_autor_idioma_id",
                table: "autor",
                column: "idioma_id");

            migrationBuilder.CreateIndex(
                name: "IX_audiolibro_idioma_id",
                table: "audiolibro",
                column: "idioma_id");

            migrationBuilder.CreateIndex(
                name: "IX_audiolibro_narrador_id",
                table: "audiolibro",
                column: "narrador_id");

            migrationBuilder.AddForeignKey(
                name: "FK_audiolibro_idioma_idioma_id",
                table: "audiolibro",
                column: "idioma_id",
                principalTable: "idioma",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_audiolibro_narrador_narrador_id",
                table: "audiolibro",
                column: "narrador_id",
                principalTable: "narrador",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_autor_idioma_idioma_id",
                table: "autor",
                column: "idioma_id",
                principalTable: "idioma",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_libro_idioma_idioma_id",
                table: "libro",
                column: "idioma_id",
                principalTable: "idioma",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
