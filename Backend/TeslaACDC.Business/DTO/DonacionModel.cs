using System;

namespace TeslaACDC.Business.DTO;

public class DonacionModel
{
    public int Id { get; set; }
    public string UsuarioId { get; set; }
    public decimal Monto { get; set; }
    public DateTime FechaDonacion { get; set; } = DateTime.UtcNow;
    public string MedioPago { get; set; }
    public string Moneda { get; set; }
}
