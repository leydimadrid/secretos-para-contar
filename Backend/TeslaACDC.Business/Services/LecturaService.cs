using System;
using System.Net;
using AutoMapper;
using TeslaACDC.Business.DTO;
using TeslaACDC.Business.Interfaces;
using TeslaACDC.Data;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Services;

public class LecturaService : ILecturaService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public LecturaService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<BaseMessage<LecturaModel>> GetAllLecturas()
    {
        var lista = await _unitOfWork.LecturaRepository.GetAllAsync();

        var listaMapeada = _mapper.Map<List<LecturaModel>>(lista);

        return lista.Any()
            ? BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.OK, lista.Count())
            : BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<LecturaModel>> AddLectura(LecturaModel lecturaModel)
    {
        var lectura = _mapper.Map<Lectura>(lecturaModel);

        await _unitOfWork.LecturaRepository.AddAsync(lectura);
        await _unitOfWork.SaveAsync();

        var lecturaAgregada = _mapper.Map<LecturaModel>(lectura);

        return lecturaAgregada != null
            ? BuildMessage(new List<LecturaModel> { lecturaAgregada }, "Escucha agregada exitosamente.", HttpStatusCode.OK, 1)
            : BuildMessage(new List<LecturaModel>(), "", HttpStatusCode.InternalServerError, 0);
    }



    private BaseMessage<LecturaModel> BuildMessage(List<LecturaModel> responseElements, string message = "", HttpStatusCode
          statusCode = HttpStatusCode.OK, int totalElements = 0)
    {
        return new BaseMessage<LecturaModel>()
        {
            Message = message,
            StatusCode = statusCode,
            TotalElements = totalElements,
            ResponseElements = responseElements
        };
    }
}
