using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TeslaACDC.Data.Migrations
{
    /// <inheritdoc />
    public partial class tablaDescargaAudiolibro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "descarga");

            migrationBuilder.CreateTable(
                name: "descarga_audiolibro",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    fecha = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    audiolibro_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_descarga_audiolibro", x => x.id);
                    table.ForeignKey(
                        name: "FK_descarga_audiolibro_audiolibro_audiolibro_id",
                        column: x => x.audiolibro_id,
                        principalTable: "audiolibro",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "descarga_libro",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    fecha = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    libro_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_descarga_libro", x => x.id);
                    table.ForeignKey(
                        name: "FK_descarga_libro_libro_libro_id",
                        column: x => x.libro_id,
                        principalTable: "libro",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_descarga_audiolibro_audiolibro_id",
                table: "descarga_audiolibro",
                column: "audiolibro_id");

            migrationBuilder.CreateIndex(
                name: "IX_descarga_libro_libro_id",
                table: "descarga_libro",
                column: "libro_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "descarga_audiolibro");

            migrationBuilder.DropTable(
                name: "descarga_libro");

            migrationBuilder.CreateTable(
                name: "descarga",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    audiolibro_id = table.Column<int>(type: "integer", nullable: true),
                    libro_id = table.Column<int>(type: "integer", nullable: false),
                    fecha = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_descarga", x => x.id);
                    table.ForeignKey(
                        name: "FK_descarga_audiolibro_audiolibro_id",
                        column: x => x.audiolibro_id,
                        principalTable: "audiolibro",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_descarga_libro_libro_id",
                        column: x => x.libro_id,
                        principalTable: "libro",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_descarga_audiolibro_id",
                table: "descarga",
                column: "audiolibro_id");

            migrationBuilder.CreateIndex(
                name: "IX_descarga_libro_id",
                table: "descarga",
                column: "libro_id");
        }
    }
}
