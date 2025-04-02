

namespace TeslaACDC.Data.Models;

public class AudiolibroGenero : BaseEntity<int>
{
    public int AudiolibroId { get; set; }
    public Audiolibro AudioLibro { get; set; } = null!;

    public int GeneroId { get; set; }
    public Genero Genero { get; set; } = null!;
}
