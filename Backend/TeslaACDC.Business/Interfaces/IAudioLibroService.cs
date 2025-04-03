using System;
using TeslaACDC.Business.DTO;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Interfaces;

public interface IAudiolibroService
{
    public Task<BaseMessage<AudiolibroResumen>> GetAllAudiolibros();
    public Task<BaseMessage<AudiolibroCrear>> CreateAudiolibro(AudiolibroCrear audiolibro);
    public Task<BaseMessage<AudiolibroCrear>> UpdateAudiolibro(int id, AudiolibroCrear audiolibro);
    public Task<BaseMessage<AudiolibroCrear>> DeleteAudiolibro(int id);
    public Task<BaseMessage<AudiolibroDetalle>> FindById(int id);
    public Task<BaseMessage<byte[]>> DescargarAudiolibro(int id);
    public Task<bool> RegistrarDescarga(int id);
}
