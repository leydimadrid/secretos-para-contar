using System;
using TeslaACDC.Business.DTO;
using TeslaACDC.Data;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Interfaces;

public interface IAutorService
{
    public Task<BaseMessage<AutorResumen>> GetAllAutores();
    public Task<BaseMessage<AutorCrear>> CreateAutor(AutorCrear autor);
    public Task<BaseMessage<AutorCrear>> UpdateAutor(int id, AutorCrear autor);
    public Task<BaseMessage<AutorCrear>> DeleteAutor(int id);
    public Task<BaseMessage<AutorDetalle>> FindAutorById(int id);
    public Task<BaseMessage<AutorResumen>> FindAutorByNombre(string nombre);
    public Task<BaseMessage<AutorResumen>> FindAutorByNacionalidad(string nacionalidad);

    public Task Deactivate(int id);
}
