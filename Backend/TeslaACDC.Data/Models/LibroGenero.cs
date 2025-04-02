

namespace TeslaACDC.Data.Models;

public class LibroGenero : BaseEntity<int>
{
    public int LibroId { get; set; }
    public Libro Libro { get; set; } = null!;

    public int GeneroId { get; set; }
    public Genero Genero { get; set; } = null!;
}
