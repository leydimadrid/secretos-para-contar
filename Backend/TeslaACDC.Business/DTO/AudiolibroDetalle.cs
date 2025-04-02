using System;

namespace TeslaACDC.Business.DTO;

public class AudiolibroDetalle : AudiolibroResumen
{
    public int AutorId { get; set; }
    public int GeneroId { get; set; }
    public string TamañoMB { get; set; } = string.Empty;
    public string Narrador { get; set; } = string.Empty;
    public string Idioma { get; set; } = string.Empty;
    public string PathArchivo { get; set; } = string.Empty;
    public int TotalEscuchas { get; set; }
    public int TotalDescargas { get; set; }

    public List<AudiolibroResumen> AudiolibrosRelacionados { get; set; } = new List<AudiolibroResumen>();
}