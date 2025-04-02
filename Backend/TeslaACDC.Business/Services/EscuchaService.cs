using System;
using System.Net;
using AutoMapper;
using TeslaACDC.Business.DTO;
using TeslaACDC.Business.Interfaces;
using TeslaACDC.Data;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Services;

public class EscuchaService : IEscuchaService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public EscuchaService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<BaseMessage<EscuchaModel>> GetAllEscuchas()
    {
        var lista = await _unitOfWork.EscuchaRepository.GetAllAsync();

        var listaMapeada = _mapper.Map<List<EscuchaModel>>(lista);

        return lista.Any()
            ? BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.OK, lista.Count())
            : BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.NotFound, 0);
    }
    public async Task<BaseMessage<EscuchaModel>> AddEscucha(EscuchaModel escuchaModel)
    {
        var escucha = _mapper.Map<Escucha>(escuchaModel);

        await _unitOfWork.EscuchaRepository.AddAsync(escucha);
        await _unitOfWork.SaveAsync();

        var escuchaAgregada = _mapper.Map<EscuchaModel>(escucha);

        return escuchaAgregada != null
            ? BuildMessage(new List<EscuchaModel> { escuchaAgregada }, "Escucha agregada exitosamente.", HttpStatusCode.OK, 1)
            : BuildMessage(new List<EscuchaModel>(), "", HttpStatusCode.InternalServerError, 0);
    }

    private BaseMessage<EscuchaModel> BuildMessage(List<EscuchaModel> responseElements, string message = "", HttpStatusCode
          statusCode = HttpStatusCode.OK, int totalElements = 0)
    {
        return new BaseMessage<EscuchaModel>()
        {
            Message = message,
            StatusCode = statusCode,
            TotalElements = totalElements,
            ResponseElements = responseElements
        };
    }
}
