using System;

namespace TeslaACDC.Business.DTO;

public class DescargaModelAudiolibro
{
    public int Id { get; set; }
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
    public int? AudiolibroId { get; set; }
}