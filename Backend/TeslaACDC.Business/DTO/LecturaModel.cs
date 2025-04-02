using System;

namespace TeslaACDC.Business.DTO;

public class LecturaModel
{
    public int Id { get; set; }
    public DateTime Fecha { get; set; }
    public int? LibroId { get; set; }
}
