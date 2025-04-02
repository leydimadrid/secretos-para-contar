using System;
using TeslaACDC.Business.DTO;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Interfaces;

public interface IGeneroService
{
    public Task<BaseMessage<GeneroModel>> GetAllGeneros();
    public Task<BaseMessage<GeneroModel>> AddGenero(GeneroModel genero);
    public Task<BaseMessage<GeneroModel>> UpdateGenero(int id, GeneroModel genero);
    public Task<BaseMessage<GeneroModel>> DeleteGenero(int id);
}
