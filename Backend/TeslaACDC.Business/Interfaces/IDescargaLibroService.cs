using System;
using TeslaACDC.Business.DTO;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Interfaces;

public interface IDescargaLibroService
{
    public Task<BaseMessage<DescargaModelLibro>> GetAllDescargas();
    public Task<BaseMessage<DescargaModelLibro>> AddDescarga(DescargaModelLibro descarga);
}
