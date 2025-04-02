using System;

namespace TeslaACDC.Business.DTO;

public class AutorCrear
{
    public string Nombre { get; set; }
    public string Apellido { get; set; }
    public int GeneroId { get; set; }
    public string Foto { get; set; }
    public string Nacionalidad { get; set; } = string.Empty;
    public string Biografia { get; set; } = string.Empty;
    public string Idioma { get; set; }
}
