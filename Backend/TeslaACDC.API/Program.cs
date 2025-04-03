using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TeslaACDC.Business.Interfaces;
using TeslaACDC.Business.Services;
using TeslaACDC.Data;
using TeslaACDC.Data.Models;
using FluentValidation;
using TeslaACDC.Business.Mapping;
using TeslaACDC.Business.DTO;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);
// Configurar límites de tamaño de archivo y tiempos de espera
builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<FileStorageConfig>>().Value);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Agregar esto después de crear el builder
builder.Services.Configure<KestrelServerOptions>(options =>
{
    options.Limits.MaxRequestBodySize = 100 * 1024 * 1024; // 100 MB
});

builder.Services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = 100 * 1024 * 1024; // 100 MB
    options.MultipartHeadersLengthLimit = int.MaxValue;
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAutoMapper(typeof(MappingProfile));




// Configurar Swagger con autenticación JWT
builder.Services.AddSwaggerGen(c =>
{
    c.UseAllOfForInheritance();
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API SECRETOS PARA CONTAR", Version = "v1" });

    // Definir esquema de seguridad JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Ingrese el token JWT en el formato: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });

    // Aplicar seguridad globalmente a todas las rutas
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new List<string>()
        }
    });

    // Configuración para manejar correctamente IFormFile
    c.OperationFilter<FileUploadOperationFilter>();
});


//Inyección de dependencias
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IAutorService, AutorService>();
builder.Services.AddScoped<ILibroService, LibroService>();
builder.Services.AddScoped<IAudiolibroService, AudiolibroService>();
builder.Services.AddScoped<IGeneroService, GeneroService>();
builder.Services.AddScoped<IDescargaLibroService, DescargaLibroService>();
builder.Services.AddScoped<IDescargaAudiolibroService, DescargaAudiolibroService>();
builder.Services.AddScoped<ILecturaService, LecturaService>();
builder.Services.AddScoped<IEscuchaService, EscuchaService>();
builder.Services.AddScoped<IDonacionService, DonacionService>();


builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<TeslaContext>()
    .AddDefaultTokenProviders();
builder.Services.AddScoped<IValidator<LibroDetalle>, ValidacionesLibro>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:ValidAudience"],
        ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"]))
    };
});


builder.Services.AddDbContext<TeslaContext>(
    options => options.UseNpgsql(builder.Configuration.GetConnectionString("TeslaDatabase"))
);

var app = builder.Build();
// PopulateDB(app);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Secretos para contar v1");
        c.RoutePrefix = string.Empty;
        c.ConfigObject.AdditionalItems["http"] = "true";
    });
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "uploads", "libros", "portadas")),
    RequestPath = "/portadas"
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "uploads", "libros", "pdf")),
    RequestPath = "/pdf"
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "uploads", "autores")),
    RequestPath = "/autores"
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "uploads", "audiolibros", "portadasAudio")),
    RequestPath = "/portadasAudio"
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "uploads", "audiolibros", "archivos")),
    RequestPath = "/archivos"
});
app.MapControllers();

app.Run();

