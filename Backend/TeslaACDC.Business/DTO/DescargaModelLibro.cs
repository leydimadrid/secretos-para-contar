using System;

namespace TeslaACDC.Business.DTO;

public class DescargaModelLibro
{
    public int Id { get; set; }
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
    public int? LibroId { get; set; }
}