using System;

namespace TeslaACDC.Data.Models;


public class Genero : BaseEntity<int>
{
    public string Nombre { get; set; } = string.Empty;
    public ICollection<LibroGenero> LibroGeneros { get; set; } = new List<LibroGenero>();

}

