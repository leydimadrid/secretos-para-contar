using System;

namespace TeslaACDC.Data.Models;

public class AutorGenero : BaseEntity<int>
{
 public int AutorId { get; set; }
    public Autor Autor { get; set; } = null!;

    public int GeneroId { get; set; }
    public Genero Genero { get; set; } = null!;
}
