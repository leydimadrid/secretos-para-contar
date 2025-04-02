
namespace TeslaACDC.Data.Models;

public class LibroAutor : BaseEntity<int>
{
    public int LibroId { get; set; }
    public Libro Libro { get; set; } = null!;

    public int AutorId { get; set; }
    public Autor Autor { get; set; } = null!;
}
