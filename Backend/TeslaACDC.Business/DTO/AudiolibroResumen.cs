using System;

namespace TeslaACDC.Business.DTO;

public class AudiolibroResumen
{
    public int id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Autor { get; set; } = string.Empty;
    public string Genero { get; set; } = string.Empty;
    public string Duracion { get; set; } = string.Empty;
    public string? Portada { get; set; }

}
