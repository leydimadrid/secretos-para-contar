using System;
using Microsoft.AspNetCore.Http;

namespace TeslaACDC.Business.DTO;

public class LibroDetalle : LibroResumen
{
    public int AutorId { get; set; }
    public int GeneroId { get; set; }
    public string ISBN13 { get; set; } = string.Empty;
    public string ContraPortada { get; set; } = string.Empty;
    public int AnioPublicacion { get; set; }
    public string Editorial { get; set; } = string.Empty;
    public string Idioma { get; set; }
    public int TotalDescargas { get; set; }
    public int TotalLecturas { get; set; }

    public List<LibroResumen> LibrosRelacionados { get; set; } = new List<LibroResumen>();
}
