using System;
using System.ComponentModel.DataAnnotations;

namespace TeslaACDC.Data.Models;

public class Autor : BaseEntity<int>
{
    public string Nombre { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public string Seudonimo { get; set; } = string.Empty;
    public string? Foto { get; set; }
    public DateOnly? FechaNacimiento { get; set; }
    public DateOnly? FechaMuerte { get; set; }
    public string Pais { get; set; } = string.Empty;
    public string Nacionalidad { get; set; } = string.Empty;
    public bool EstaVivo { get; set; }
    public string Biografia { get; set; } = string.Empty;
    public string Idioma { get; set; }

    public ICollection<LibroAutor> LibroAutores { get; set; } = new List<LibroAutor>();
    public ICollection<AudiolibroAutor> AudiolibroAutores { get; set; } = new List<AudiolibroAutor>();
    public ICollection<AutorGenero> AutorGeneros { get; set; } = new List<AutorGenero>();



}
