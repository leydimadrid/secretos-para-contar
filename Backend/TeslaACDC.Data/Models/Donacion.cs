using System;

namespace TeslaACDC.Data.Models;

public class Donacion : BaseEntity<int>
{
    public decimal Monto { get; set; }
    public DateTime FechaDonacion { get; set; } = DateTime.UtcNow;
    public string MedioPago { get; set; } = string.Empty;
    public string Moneda { get; set; } = "USD";
    public string UsuarioId { get; set; }
    public ApplicationUser Usuario { get; set; }
}
