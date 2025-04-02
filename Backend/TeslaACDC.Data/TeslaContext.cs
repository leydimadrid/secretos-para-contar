using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Data;

public class TeslaContext : IdentityDbContext<ApplicationUser>
{
    public TeslaContext(DbContextOptions<TeslaContext> options) : base(options)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }
    public DbSet<Autor> Autores { get; set; }
    public DbSet<Libro> Libros { get; set; }
    public DbSet<Audiolibro> Audiolibros { get; set; }
    public DbSet<DescargaLibro> DescargasLibro { get; set; }
    public DbSet<DescargaAudiolibro> DescargasAudiolibro { get; set; }
    public DbSet<Lectura> Lecturas { get; set; }
    public DbSet<Escucha> Escuchas { get; set; }
    public DbSet<Genero> Generos { get; set; }
    public DbSet<Donacion> Donaciones { get; set; }
    public DbSet<ApplicationUser> Usuarios { get; set; }

    // Tablas intermedias
    public DbSet<LibroAutor> LibroAutores { get; set; }
    public DbSet<LibroGenero> LibroGeneros { get; set; }
    public DbSet<AutorGenero> AutorGeneros { get; set; }
    public DbSet<AudiolibroAutor> AudiolibroAutores { get; set; }
    public DbSet<AudiolibroGenero> AudiolibroGeneros { get; set; }




    protected override void OnModelCreating(ModelBuilder builder)
    {

        foreach (var entity in builder.Model.GetEntityTypes())
        {
            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(ConvertToSnakeCase(property.Name));
            }
        }
        if (builder == null)
        {
            return;
        }

        // Tablas principales
        builder.Entity<Autor>().ToTable("autor").HasKey(k => k.id);
        builder.Entity<Libro>().ToTable("libro").HasKey(k => k.id);
        builder.Entity<Audiolibro>().ToTable("audiolibro").HasKey(k => k.id);
        builder.Entity<DescargaLibro>().ToTable("descarga_libro").HasKey(d => d.id);
        builder.Entity<DescargaAudiolibro>().ToTable("descarga_audiolibro").HasKey(d => d.id);
        builder.Entity<Lectura>().ToTable("lectura").HasKey(l => l.id);
        builder.Entity<Escucha>().ToTable("escucha").HasKey(e => e.id);
        builder.Entity<Genero>().ToTable("genero").HasKey(g => g.id);
        builder.Entity<Donacion>().ToTable("donacion").HasKey(d => d.id);
        builder.Entity<Donacion>()
            .HasOne(d => d.Usuario)
            .WithMany()
            .HasForeignKey(d => d.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relación Autor - Género (Muchos a Muchos)
        builder.Entity<AutorGenero>().ToTable("autor_genero").HasKey(lg => new { lg.AutorId, lg.GeneroId });

        builder.Entity<AutorGenero>()
            .HasOne(lg => lg.Autor)
            .WithMany(l => l.AutorGeneros)
            .HasForeignKey(lg => lg.AutorId);

        builder.Entity<AutorGenero>()
            .HasOne(lg => lg.Genero)
            .WithMany()
            .HasForeignKey(lg => lg.GeneroId);

        // Relación Libro - Género (Muchos a Muchos)
        builder.Entity<LibroGenero>().ToTable("libro_genero").HasKey(lg => new { lg.LibroId, lg.GeneroId });

        builder.Entity<LibroGenero>()
            .HasOne(lg => lg.Libro)
            .WithMany(l => l.LibroGeneros)
            .HasForeignKey(lg => lg.LibroId);

        builder.Entity<LibroGenero>()
            .HasOne(lg => lg.Genero)
            .WithMany(g => g.LibroGeneros)
            .HasForeignKey(lg => lg.GeneroId);


        // Relación Libro - Autor (Muchos a Muchos)
        builder.Entity<LibroAutor>().ToTable("libro_autor").HasKey(la => new { la.LibroId, la.AutorId });

        builder.Entity<LibroAutor>()
            .HasOne(la => la.Libro)
            .WithMany(l => l.LibroAutores)
            .HasForeignKey(la => la.LibroId);

        builder.Entity<LibroAutor>()
            .HasOne(la => la.Autor)
            .WithMany(a => a.LibroAutores)
            .HasForeignKey(la => la.AutorId);

        // Relación Audiolibro - Género (Muchos a Muchos)
        builder.Entity<AudiolibroGenero>().ToTable("audiolibro_genero").HasKey(lg => new { lg.AudiolibroId, lg.GeneroId });

        builder.Entity<AudiolibroGenero>()
            .HasOne(lg => lg.AudioLibro)
            .WithMany(l => l.AudiolibroGeneros)
            .HasForeignKey(lg => lg.AudiolibroId);

        builder.Entity<AudiolibroGenero>()
            .HasOne(lg => lg.Genero)
            .WithMany()
            .HasForeignKey(lg => lg.GeneroId);

        // Relación Audiolibro - Autor (Muchos a Muchos)
        builder.Entity<AudiolibroAutor>().ToTable("audiolibro_autor").HasKey(la => new { la.AudiolibroId, la.AutorId });

        builder.Entity<AudiolibroAutor>()
            .HasOne(la => la.AudioLibro)
            .WithMany(l => l.AudiolibroAutores)
            .HasForeignKey(la => la.AudiolibroId);

        builder.Entity<AudiolibroAutor>()
            .HasOne(la => la.Autor)
            .WithMany(a => a.AudiolibroAutores)
            .HasForeignKey(la => la.AutorId);


        base.OnModelCreating(builder);
    }

    private string ConvertToSnakeCase(string name)
    {
        return string.Concat(name.Select((x, i) => i > 0 && char.IsUpper(x) ? "_" + x : x.ToString())).ToLower();
    }
}
