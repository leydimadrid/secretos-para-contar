using System;

namespace TeslaACDC.Business.DTO;

public class LibroResumen
{
    public int id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Autor { get; set; }
    public string Genero { get; set; }
    public string? Portada { get; set; }
}