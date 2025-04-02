using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeslaACDC.Data.Models;

public class Lectura : BaseEntity<int>
{
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
    public int LibroId { get; set; }
    
    [ForeignKey("LibroId")]
    public virtual Libro Libro { get; set; }
}
