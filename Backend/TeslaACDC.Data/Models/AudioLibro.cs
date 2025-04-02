using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeslaACDC.Data.Models;

public class Audiolibro : BaseEntity<int>
{
    public string Titulo { get; set; } = string.Empty;
    public string Duracion { get; set; }
    public string TamañoMB { get; set; }
    public string Portada { get; set; } = string.Empty;
    public string PathArchivo { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public string Narrador { get; set; }
    public string Idioma { get; set; }

    public ICollection<AudiolibroGenero> AudiolibroGeneros { get; set; } = new List<AudiolibroGenero>();
    public ICollection<AudiolibroAutor> AudiolibroAutores { get; set; } = new List<AudiolibroAutor>();

}
