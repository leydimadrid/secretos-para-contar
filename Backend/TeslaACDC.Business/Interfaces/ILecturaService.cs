using System;
using TeslaACDC.Business.DTO;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Interfaces;

public interface ILecturaService
{
    public Task<BaseMessage<LecturaModel>> GetAllLecturas();
    public Task<BaseMessage<LecturaModel>> AddLectura(LecturaModel lectura);

}
