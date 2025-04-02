using System;
using System.Net;
using AutoMapper;
using TeslaACDC.Business.DTO;
using TeslaACDC.Business.Interfaces;
using TeslaACDC.Data;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Services;

public class DonacionService : IDonacionService
{

    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public DonacionService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<BaseMessage<DonacionModel>> GetAllDonaciones()
    {
        var lista = await _unitOfWork.DonacionRepository.GetAllAsync();
        var listaMapeada = _mapper.Map<List<DonacionModel>>(lista);

        return lista.Any()
            ? BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.OK, lista.Count())
            : BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<DonacionModel>> AddDonacion(DonacionModel donacionModel)
    {
        var donacion = _mapper.Map<Donacion>(donacionModel);

        await _unitOfWork.DonacionRepository.AddAsync(donacion);
        await _unitOfWork.SaveAsync();

        var donacionAgregada = _mapper.Map<DonacionModel>(donacion);

        return donacionAgregada != null
            ? BuildMessage(new List<DonacionModel> { donacionAgregada }, "Donación agregada exitosamente.", HttpStatusCode.OK, 1)
            : BuildMessage(new List<DonacionModel>(), "", HttpStatusCode.InternalServerError, 0);
    }

    

    private BaseMessage<DonacionModel> BuildMessage(List<DonacionModel> responseElements, string message = "", HttpStatusCode
      statusCode = HttpStatusCode.OK, int totalElements = 0)
    {
        return new BaseMessage<DonacionModel>()
        {
            Message = message,
            StatusCode = statusCode,
            TotalElements = totalElements,
            ResponseElements = responseElements
        };
    }


}
