

namespace TeslaACDC.Data.Models;

public class AudiolibroAutor :BaseEntity<int>
{
    public int AudiolibroId { get; set; }
    public Audiolibro AudioLibro { get; set; } = null!;

    public int AutorId { get; set; }
    public Autor Autor { get; set; } = null!;
}
