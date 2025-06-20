using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TeslaACDC.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    normalized_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    concurrency_stamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    last_name = table.Column<string>(type: "text", nullable: false),
                    user_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    normalized_user_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    normalized_email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    email_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: true),
                    security_stamp = table.Column<string>(type: "text", nullable: true),
                    concurrency_stamp = table.Column<string>(type: "text", nullable: true),
                    phone_number = table.Column<string>(type: "text", nullable: true),
                    phone_number_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    two_factor_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    lockout_end = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    lockout_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    access_failed_count = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "genero",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_genero", x => x.id);
                });

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
                    nombre = table.Column<string>(type: "text", nullable: false),
                    apellidos = table.Column<string>(type: "text", nullable: false),
                    nacionalidad = table.Column<string>(type: "text", nullable: false),
                    fecha_nacimiento = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_narrador", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    role_id = table.Column<string>(type: "text", nullable: false),
                    claim_type = table.Column<string>(type: "text", nullable: true),
                    claim_value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_role_id",
                        column: x => x.role_id,
                        principalTable: "AspNetRoles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    claim_type = table.Column<string>(type: "text", nullable: true),
                    claim_value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    login_provider = table.Column<string>(type: "text", nullable: false),
                    provider_key = table.Column<string>(type: "text", nullable: false),
                    provider_display_name = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.login_provider, x.provider_key });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    user_id = table.Column<string>(type: "text", nullable: false),
                    role_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.user_id, x.role_id });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_role_id",
                        column: x => x.role_id,
                        principalTable: "AspNetRoles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    user_id = table.Column<string>(type: "text", nullable: false),
                    login_provider = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.user_id, x.login_provider, x.name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "autor",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "text", nullable: false),
                    apellidos = table.Column<string>(type: "text", nullable: false),
                    seudonimo = table.Column<string>(type: "text", nullable: false),
                    fecha_nacimiento = table.Column<DateOnly>(type: "date", nullable: true),
                    fecha_muerte = table.Column<DateOnly>(type: "date", nullable: true),
                    pais = table.Column<string>(type: "text", nullable: false),
                    nacionalidad = table.Column<string>(type: "text", nullable: false),
                    esta_vivo = table.Column<bool>(type: "boolean", nullable: false),
                    biografia = table.Column<string>(type: "text", nullable: false),
                    idioma_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_autor", x => x.id);
                    table.ForeignKey(
                        name: "FK_autor_idioma_idioma_id",
                        column: x => x.idioma_id,
                        principalTable: "idioma",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "libro",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    titulo = table.Column<string>(type: "text", nullable: false),
                    i_s_b_n13 = table.Column<string>(type: "text", nullable: false),
                    editorial = table.Column<string>(type: "text", nullable: false),
                    anio_publicacion = table.Column<int>(type: "integer", nullable: false),
                    formato = table.Column<string>(type: "text", nullable: false),
                    portada = table.Column<string>(type: "text", nullable: false),
                    edicion = table.Column<string>(type: "text", nullable: false),
                    contra_portada = table.Column<string>(type: "text", nullable: false),
                    fecha_creacion = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    idioma_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_libro", x => x.id);
                    table.ForeignKey(
                        name: "FK_libro_idioma_idioma_id",
                        column: x => x.idioma_id,
                        principalTable: "idioma",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "audiolibro",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    titulo = table.Column<string>(type: "text", nullable: false),
                    duracion = table.Column<int>(type: "integer", nullable: false),
                    tamaño_m_b = table.Column<double>(type: "double precision", nullable: false),
                    url = table.Column<string>(type: "text", nullable: false),
                    fecha_creacion = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    narrador_id = table.Column<int>(type: "integer", nullable: false),
                    idioma_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audiolibro", x => x.id);
                    table.ForeignKey(
                        name: "FK_audiolibro_idioma_idioma_id",
                        column: x => x.idioma_id,
                        principalTable: "idioma",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_audiolibro_narrador_narrador_id",
                        column: x => x.narrador_id,
                        principalTable: "narrador",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "lectura",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    fecha = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    libro_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lectura", x => x.id);
                    table.ForeignKey(
                        name: "FK_lectura_libro_libro_id",
                        column: x => x.libro_id,
                        principalTable: "libro",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "libro_autor",
                columns: table => new
                {
                    libro_id = table.Column<int>(type: "integer", nullable: false),
                    autor_id = table.Column<int>(type: "integer", nullable: false),
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_libro_autor", x => new { x.libro_id, x.autor_id });
                    table.ForeignKey(
                        name: "FK_libro_autor_autor_autor_id",
                        column: x => x.autor_id,
                        principalTable: "autor",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_libro_autor_libro_libro_id",
                        column: x => x.libro_id,
                        principalTable: "libro",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "libro_genero",
                columns: table => new
                {
                    libro_id = table.Column<int>(type: "integer", nullable: false),
                    genero_id = table.Column<int>(type: "integer", nullable: false),
                    Generoid = table.Column<int>(type: "integer", nullable: true),
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_libro_genero", x => new { x.libro_id, x.genero_id });
                    table.ForeignKey(
                        name: "FK_libro_genero_genero_Generoid",
                        column: x => x.Generoid,
                        principalTable: "genero",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_libro_genero_genero_genero_id",
                        column: x => x.genero_id,
                        principalTable: "genero",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_libro_genero_libro_libro_id",
                        column: x => x.libro_id,
                        principalTable: "libro",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "audiolibro_autor",
                columns: table => new
                {
                    audiolibro_id = table.Column<int>(type: "integer", nullable: false),
                    autor_id = table.Column<int>(type: "integer", nullable: false),
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audiolibro_autor", x => new { x.audiolibro_id, x.autor_id });
                    table.ForeignKey(
                        name: "FK_audiolibro_autor_audiolibro_audiolibro_id",
                        column: x => x.audiolibro_id,
                        principalTable: "audiolibro",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_audiolibro_autor_autor_autor_id",
                        column: x => x.autor_id,
                        principalTable: "autor",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "audiolibro_genero",
                columns: table => new
                {
                    audiolibro_id = table.Column<int>(type: "integer", nullable: false),
                    genero_id = table.Column<int>(type: "integer", nullable: false),
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audiolibro_genero", x => new { x.audiolibro_id, x.genero_id });
                    table.ForeignKey(
                        name: "FK_audiolibro_genero_audiolibro_audiolibro_id",
                        column: x => x.audiolibro_id,
                        principalTable: "audiolibro",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_audiolibro_genero_genero_genero_id",
                        column: x => x.genero_id,
                        principalTable: "genero",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "descarga",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    fecha = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    libro_id = table.Column<int>(type: "integer", nullable: false),
                    audiolibro_id = table.Column<int>(type: "integer", nullable: true)
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

            migrationBuilder.CreateTable(
                name: "escucha",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    fecha = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    audiolibro_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_escucha", x => x.id);
                    table.ForeignKey(
                        name: "FK_escucha_audiolibro_audiolibro_id",
                        column: x => x.audiolibro_id,
                        principalTable: "audiolibro",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_role_id",
                table: "AspNetRoleClaims",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "normalized_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_user_id",
                table: "AspNetUserClaims",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_user_id",
                table: "AspNetUserLogins",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_role_id",
                table: "AspNetUserRoles",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "normalized_email");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "normalized_user_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_audiolibro_idioma_id",
                table: "audiolibro",
                column: "idioma_id");

            migrationBuilder.CreateIndex(
                name: "IX_audiolibro_narrador_id",
                table: "audiolibro",
                column: "narrador_id");

            migrationBuilder.CreateIndex(
                name: "IX_audiolibro_autor_autor_id",
                table: "audiolibro_autor",
                column: "autor_id");

            migrationBuilder.CreateIndex(
                name: "IX_audiolibro_genero_genero_id",
                table: "audiolibro_genero",
                column: "genero_id");

            migrationBuilder.CreateIndex(
                name: "IX_autor_idioma_id",
                table: "autor",
                column: "idioma_id");

            migrationBuilder.CreateIndex(
                name: "IX_descarga_audiolibro_id",
                table: "descarga",
                column: "audiolibro_id");

            migrationBuilder.CreateIndex(
                name: "IX_descarga_libro_id",
                table: "descarga",
                column: "libro_id");

            migrationBuilder.CreateIndex(
                name: "IX_escucha_audiolibro_id",
                table: "escucha",
                column: "audiolibro_id");

            migrationBuilder.CreateIndex(
                name: "IX_lectura_libro_id",
                table: "lectura",
                column: "libro_id");

            migrationBuilder.CreateIndex(
                name: "IX_libro_idioma_id",
                table: "libro",
                column: "idioma_id");

            migrationBuilder.CreateIndex(
                name: "IX_libro_autor_autor_id",
                table: "libro_autor",
                column: "autor_id");

            migrationBuilder.CreateIndex(
                name: "IX_libro_genero_genero_id",
                table: "libro_genero",
                column: "genero_id");

            migrationBuilder.CreateIndex(
                name: "IX_libro_genero_Generoid",
                table: "libro_genero",
                column: "Generoid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "audiolibro_autor");

            migrationBuilder.DropTable(
                name: "audiolibro_genero");

            migrationBuilder.DropTable(
                name: "descarga");

            migrationBuilder.DropTable(
                name: "escucha");

            migrationBuilder.DropTable(
                name: "lectura");

            migrationBuilder.DropTable(
                name: "libro_autor");

            migrationBuilder.DropTable(
                name: "libro_genero");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "audiolibro");

            migrationBuilder.DropTable(
                name: "autor");

            migrationBuilder.DropTable(
                name: "genero");

            migrationBuilder.DropTable(
                name: "libro");

            migrationBuilder.DropTable(
                name: "narrador");

            migrationBuilder.DropTable(
                name: "idioma");
        }
    }
}
