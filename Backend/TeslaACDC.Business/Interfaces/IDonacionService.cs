using System;
using TeslaACDC.Business.DTO;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Interfaces;

public interface IDonacionService
{
    public Task<BaseMessage<DonacionModel>> GetAllDonaciones();
    public Task<BaseMessage<DonacionModel>> AddDonacion(DonacionModel donacion);
}
