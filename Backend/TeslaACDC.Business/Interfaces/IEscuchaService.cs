using System;
using TeslaACDC.Business.DTO;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Interfaces;

public interface IEscuchaService
{
    public Task<BaseMessage<EscuchaModel>> GetAllEscuchas();
    public Task<BaseMessage<EscuchaModel>> AddEscucha(EscuchaModel escucha);

}
