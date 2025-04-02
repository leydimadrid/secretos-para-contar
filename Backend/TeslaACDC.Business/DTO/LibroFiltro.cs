using System;

namespace TeslaACDC.Business.DTO;

public class LibroFiltro
{
    public int? AutorId { get; set; }
    public int? GeneroId { get; set; }
    public int? AnioPublicacion { get; set; }
    public string? Editorial { get; set; }
}

