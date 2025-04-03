using System;
using Microsoft.AspNetCore.Http;

namespace TeslaACDC.Business.DTO;

public class AudiolibroCrear
{
    public string Titulo { get; set; } = string.Empty;
    public int AutorId { get; set; }
    public int GeneroId { get; set; }
    public string Duracion { get; set; } = string.Empty;
    public string Portada { get; set; } = string.Empty;
    public string TamañoMB { get; set; } = string.Empty;
    public string Narrador { get; set; } = string.Empty;
    public string Idioma { get; set; } = string.Empty;
    public IFormFile PathArchivo { get; set; }

}
