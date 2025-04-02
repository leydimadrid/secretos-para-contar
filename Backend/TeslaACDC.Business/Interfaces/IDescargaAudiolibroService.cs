using System;
using TeslaACDC.Business.DTO;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Interfaces;

public interface IDescargaAudiolibroService
{
    public Task<BaseMessage<DescargaModelAudiolibro>> GetAllDescargas();
    public Task<BaseMessage<DescargaModelAudiolibro>> AddDescarga(DescargaModelAudiolibro descarga);
}
