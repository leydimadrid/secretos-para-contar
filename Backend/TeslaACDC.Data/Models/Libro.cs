using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TeslaACDC.Data.Models;

public class Libro : BaseEntity<int>
{
    public string Titulo { get; set; } = string.Empty;
    public string ISBN13 { get; set; } = string.Empty;
    public string Editorial { get; set; } = string.Empty;
    public int AnioPublicacion { get; set; }
    public string Formato { get; set; } = string.Empty;
    public string? Portada { get; set; }
    public string Edicion { get; set; } = string.Empty;
    public string ContraPortada { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public string? Idioma { get; set; }
    public string PathArchivo { get; set; } = string.Empty;

    public ICollection<LibroGenero> LibroGeneros { get; set; } = new List<LibroGenero>();
    public ICollection<LibroAutor> LibroAutores { get; set; } = new List<LibroAutor>();

}
