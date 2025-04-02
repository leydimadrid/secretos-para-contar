using System;

namespace TeslaACDC.Business.DTO;

public class AutorDetalle : AutorResumen
{

    public string Seudonimo { get; set; } = string.Empty;
    public DateOnly? FechaNacimiento { get; set; }
    public string Pais { get; set; } = string.Empty;
    public bool EstaVivo { get; set; }
    public string Biografia { get; set; } = string.Empty;
    public string Idioma { get; set; }

    public List<LibroResumen> LibrosRelacionados { get; set; } = new List<LibroResumen>();
}