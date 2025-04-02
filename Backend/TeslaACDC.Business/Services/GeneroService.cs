using System;
using System.Net;
using AutoMapper;
using TeslaACDC.Business.DTO;
using TeslaACDC.Business.Interfaces;
using TeslaACDC.Data;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Services;

public class GeneroService : IGeneroService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GeneroService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<BaseMessage<GeneroModel>> GetAllGeneros()
    {
        var lista = await _unitOfWork.GeneroRepository.GetAllAsync();

        var listaMapeada = _mapper.Map<List<GeneroModel>>(lista);

        return lista.Any()
            ? BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.OK, lista.Count())
            : BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<GeneroModel>> AddGenero(GeneroModel generoModel)
    {
        var genero = _mapper.Map<Genero>(generoModel);

        await _unitOfWork.GeneroRepository.AddAsync(genero);
        await _unitOfWork.SaveAsync();

        var generoAgregado = _mapper.Map<GeneroModel>(genero);

        return generoAgregado != null
            ? BuildMessage(new List<GeneroModel> { generoAgregado }, "Género agregado exitosamente.", HttpStatusCode.OK, 1)
            : BuildMessage(new List<GeneroModel>(), "", HttpStatusCode.InternalServerError, 0);
    }

    public async Task<BaseMessage<GeneroModel>> UpdateGenero(int id, GeneroModel generoModel)
    {
        var genero = await _unitOfWork.GeneroRepository.FindAsync(id);
        if (genero == null)
        {
            return BuildMessage(new List<GeneroModel>(), "género no encontrado", HttpStatusCode.NotFound, 0);
        }

        _mapper.Map(generoModel, genero);

        _unitOfWork.GeneroRepository.Update(genero);
        await _unitOfWork.SaveAsync();

        var generoActualizado = _mapper.Map<GeneroModel>(genero);

        return BuildMessage(new List<GeneroModel> { generoActualizado }, "", HttpStatusCode.OK, 1);
    }



    public async Task<BaseMessage<GeneroModel>> DeleteGenero(int id)
    {
        var genero = await _unitOfWork.GeneroRepository.FindAsync(id);
        if (genero == null)
        {
            return BuildMessage(new List<GeneroModel>(), "Genero no encontrado", HttpStatusCode.NotFound, 0);
        }

        _unitOfWork.GeneroRepository.Delete(genero);
        await _unitOfWork.SaveAsync();

        var generoEliminado = _mapper.Map<GeneroModel>(genero);

        return BuildMessage(new List<GeneroModel> { generoEliminado }, "", HttpStatusCode.OK, 1);
    }





    private BaseMessage<GeneroModel> BuildMessage(List<GeneroModel> responseElements, string message = "", HttpStatusCode
       statusCode = HttpStatusCode.OK, int totalElements = 0)
    {
        return new BaseMessage<GeneroModel>()
        {
            Message = message,
            StatusCode = statusCode,
            TotalElements = totalElements,
            ResponseElements = responseElements
        };
    }
}
