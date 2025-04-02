using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeslaACDC.Data.Models;

public class DescargaAudiolibro : BaseEntity<int>
{
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
    public int? AudiolibroId { get; set; }

    [ForeignKey("AudiolibroId")]
    public virtual Audiolibro? Audiolibro { get; set; }
}
