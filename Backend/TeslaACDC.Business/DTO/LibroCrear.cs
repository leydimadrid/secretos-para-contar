using System;
using Microsoft.AspNetCore.Http;

namespace TeslaACDC.Business.DTO;

public class LibroCrear
{
    public string Titulo { get; set; }
    public int AutorId { get; set; }
    public int GeneroId { get; set; }
    public string Idioma { get; set; }
    public string? Portada { get; set; }
    public string ContraPortada { get; set; } = string.Empty;
    public string Editorial { get; set; }
    public string ISBN13 { get; set; } = string.Empty;
    public IFormFile Pdf { get; set; }
}
