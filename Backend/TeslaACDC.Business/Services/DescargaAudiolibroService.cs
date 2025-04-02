using System;
using System.Net;
using AutoMapper;
using TeslaACDC.Business.DTO;
using TeslaACDC.Business.Interfaces;
using TeslaACDC.Data;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Services;

public class DescargaAudiolibroService : IDescargaAudiolibroService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public DescargaAudiolibroService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<BaseMessage<DescargaModelAudiolibro>> GetAllDescargas()
    {
        var lista = await _unitOfWork.DescargaLibroRepository.GetAllAsync();
        var listaMapeada = _mapper.Map<List<DescargaModelAudiolibro>>(lista);

        return lista.Any()
            ? BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.OK, lista.Count())
            : BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<DescargaModelAudiolibro>> AddDescarga(DescargaModelAudiolibro descargaModel)
    {
        var descarga = _mapper.Map<DescargaLibro>(descargaModel);

        await _unitOfWork.DescargaLibroRepository.AddAsync(descarga);
        await _unitOfWork.SaveAsync();

        var descargaAgregada = _mapper.Map<DescargaModelAudiolibro>(descarga);

        return descargaAgregada != null
            ? BuildMessage(new List<DescargaModelAudiolibro> { descargaAgregada }, "Descarga agregada exitosamente.", HttpStatusCode.OK, 1)
            : BuildMessage(new List<DescargaModelAudiolibro>(), "", HttpStatusCode.InternalServerError, 0);
    }

    private BaseMessage<DescargaModelAudiolibro> BuildMessage(List<DescargaModelAudiolibro> responseElements, string message = "", HttpStatusCode
      statusCode = HttpStatusCode.OK, int totalElements = 0)
    {
        return new BaseMessage<DescargaModelAudiolibro>()
        {
            Message = message,
            StatusCode = statusCode,
            TotalElements = totalElements,
            ResponseElements = responseElements
        };
    }
}
