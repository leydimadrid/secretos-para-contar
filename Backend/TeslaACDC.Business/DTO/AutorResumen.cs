using System;

namespace TeslaACDC.Business.DTO;

public class AutorResumen
{
    public int id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public string Nacionalidad { get; set; } = string.Empty;
    public string? Foto { get; set; }
    public string Generos { get; set; } = string.Empty;
}
