using System;
using System.Net;
using AutoMapper;
using TeslaACDC.Business.DTO;
using TeslaACDC.Business.Interfaces;
using TeslaACDC.Data;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Services;

public class AudiolibroService : IAudiolibroService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;


    public AudiolibroService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<BaseMessage<AudiolibroResumen>> GetAllAudiolibros()
    {
        var lista = await _unitOfWork.AudiolibroRepository.GetAllAsync(includeProperties: "AudiolibroAutores.Autor,AudiolibroGeneros.Genero");

        var listaMapeada = lista.Select(l => new AudiolibroResumen
        {

            id = l.id,
            Titulo = l.Titulo,
            Portada = l.Portada,
            Duracion = l.Duracion,
            Genero = string.Join(", ", l.AudiolibroGeneros?.Select(lg => lg.Genero.Nombre) ?? Array.Empty<string>()),
            Autor = string.Join(", ", l.AudiolibroAutores.Select(la => la.Autor.Nombre + " " + la.Autor.Apellidos)),
        }).ToList();

        return BuildMessage(listaMapeada,
        listaMapeada.Any() ? "Audiolibros encontrados" : "No se encontraron audiolibros",
        listaMapeada.Any() ? HttpStatusCode.OK : HttpStatusCode.NotFound);
    }

    public async Task<BaseMessage<AudiolibroResumen>> AddAudiolibro(AudiolibroResumen AudiolibroModel)
    {
        var error = new List<string>();
        if (error.Any())
        {
            return BuildMessage<AudiolibroResumen>(null, string.Join(", ", error), HttpStatusCode.BadRequest, 0);
        }
        var audiolibro = _mapper.Map<Audiolibro>(AudiolibroModel);
        await _unitOfWork.AudiolibroRepository.AddAsync(audiolibro);
        await _unitOfWork.SaveAsync();

        var audiolibroAgregado = _mapper.Map<AudiolibroResumen>(audiolibro);


        return audiolibroAgregado != null
            ? BuildMessage(new List<AudiolibroResumen> { audiolibroAgregado }, "Audio libro agregado exitosamente.", HttpStatusCode.OK, 1)
            : BuildMessage(new List<AudiolibroResumen>(), "", HttpStatusCode.InternalServerError, 0);
    }

    public async Task<BaseMessage<AudiolibroResumen>> UpdateAudiolibro(int id, AudiolibroResumen Audiolibro)
    {
        var error = new List<string>();
        if (error.Any())
        {
            return BuildMessage<AudiolibroResumen>(null, string.Join(", ", error), HttpStatusCode.BadRequest, 0);
        }

        var AudiolibroEntity = await _unitOfWork.AudiolibroRepository.FindAsync(id);
        if (AudiolibroEntity == null)
        {
            return BuildMessage(new List<AudiolibroResumen>(), "Audio libro no encontrado", HttpStatusCode.NotFound, 0);
        }

        _mapper.Map(Audiolibro, AudiolibroEntity);

        _unitOfWork.AudiolibroRepository.Update(AudiolibroEntity);
        await _unitOfWork.SaveAsync();

        var audiolibroActualizado = _mapper.Map<AudiolibroResumen>(AudiolibroEntity);

        return BuildMessage(new List<AudiolibroResumen> { audiolibroActualizado }, "", HttpStatusCode.OK, 1);

    }

    public async Task<BaseMessage<AudiolibroDetalle>> FindById(int id)
    {
        var audiolibro = await _unitOfWork.AudiolibroRepository.FindAsync(id);

        if (audiolibro == null)
        {
            return BuildMessage(new List<AudiolibroDetalle>(), "Audiolibro no encontrado", HttpStatusCode.NotFound, 0);
        }

        var AudiolibroConRelaciones = await _unitOfWork.AudiolibroRepository.GetAllAsync(
            filter: l => l.id == id,
            includeProperties: "AudiolibroAutores.Autor,AudiolibroGeneros.Genero");

        var audiolibroCompleto = AudiolibroConRelaciones.FirstOrDefault();

        if (audiolibroCompleto == null)
        {
            return BuildMessage(new List<AudiolibroDetalle>(), "Audiolibro no encontrado", HttpStatusCode.NotFound, 0);
        }

        var generosIds = audiolibroCompleto.AudiolibroGeneros?.Select(lg => lg.GeneroId).ToList() ?? new List<int>();

        var audiolibrosRelacionados = await _unitOfWork.AudiolibroRepository.GetAllAsync(
            filter: l => l.id != id && l.AudiolibroGeneros.Any(lg => generosIds.Contains(lg.GeneroId)),
            includeProperties: "AudiolibroAutores.Autor,AudiolibroGeneros.Genero");

        int totalEscuchas = await _unitOfWork.EscuchaRepository.CountAsync(e => e.AudiolibroId == id);
        int totalDescargas = await _unitOfWork.DescargaAudiolibroRepository.CountAsync(d => d.AudiolibroId == id);

        var audiolibroMapeado = new AudiolibroDetalle
        {
            id = audiolibroCompleto.id,
            Titulo = audiolibroCompleto.Titulo,
            Portada = audiolibroCompleto.Portada,
            Duracion = audiolibroCompleto.Duracion ?? string.Empty,
            TamañoMB = audiolibroCompleto.TamañoMB ?? string.Empty,
            PathArchivo = audiolibroCompleto.PathArchivo,
            Narrador = audiolibroCompleto.Narrador,
            Autor = string.Join(", ", audiolibroCompleto.AudiolibroAutores?.Select(la => la.Autor.Nombre + " " + la.Autor.Apellidos) ?? Array.Empty<string>()),
            Idioma = audiolibroCompleto.Idioma,
            TotalEscuchas = totalEscuchas,
            TotalDescargas = totalDescargas,

            AudiolibrosRelacionados = audiolibrosRelacionados.Select(l => new AudiolibroResumen
            {
                id = l.id,
                Titulo = l.Titulo,
                Portada = l.Portada,
                Genero = string.Join(", ", l.AudiolibroGeneros?.Select(lg => lg.Genero.Nombre) ?? Array.Empty<string>()),
                Autor = string.Join(", ", l.AudiolibroAutores?.Select(la => la.Autor.Nombre) ?? Array.Empty<string>()),
            }).Take(4).ToList()
        };

        var resultado = new List<AudiolibroDetalle> { audiolibroMapeado };

        return BuildMessage(resultado, "", HttpStatusCode.OK, 1);
    }

    public async Task<BaseMessage<AudiolibroResumen>> DeleteAudiolibro(int id)
    {
        var audiolibro = await _unitOfWork.AudiolibroRepository.FindAsync(id);
        if (audiolibro == null)
        {
            return BuildMessage(new List<AudiolibroResumen>(), "Audio libro no encontrado", HttpStatusCode.NotFound, 0);
        }

        _unitOfWork.AudiolibroRepository.Delete(audiolibro);
        await _unitOfWork.SaveAsync();

        var audiolibroEliminado = _mapper.Map<AudiolibroResumen>(audiolibro);

        return BuildMessage(new List<AudiolibroResumen> { audiolibroEliminado }, "", HttpStatusCode.OK, 1);
    }

    public BaseMessage<T> BuildMessage<T>(List<T> responseElements, string message = "", HttpStatusCode
    statusCode = HttpStatusCode.OK, int totalElements = 0) where T : class
    {
        return new BaseMessage<T>()
        {
            Message = message,
            StatusCode = statusCode,
            TotalElements = totalElements,
            ResponseElements = responseElements
        };
    }

    public async Task<BaseMessage<byte[]>> DescargarAudiolibro(int id)
    {
        var audiolibro = await _unitOfWork.AudiolibroRepository.FindAsync(id);
        if (audiolibro == null)
        {
            return BuildMessage<byte[]>(null, "No se pudo encontrar el archivo.", HttpStatusCode.NotFound, 0);
        }

        using var httpClient = new HttpClient();
        var response = await httpClient.GetAsync(audiolibro.PathArchivo);
        if (!response.IsSuccessStatusCode)
        {
            return BuildMessage<byte[]>(null, "No se pudo descargar el archivo.", HttpStatusCode.NotFound, 0);
        }

        var fileBytes = await response.Content.ReadAsByteArrayAsync();
        var tipoArchivo = audiolibro.PathArchivo.EndsWith(".mp3") ? "audio/mpeg" : "video/mp4";

        return BuildMessage(new List<byte[]> { fileBytes }, tipoArchivo, HttpStatusCode.OK, 0);
    }
    public async Task<bool> RegistrarDescarga(int id)
    {
        var nuevaDescarga = new DescargaModelAudiolibro
        {
            AudiolibroId = id,
            Fecha = DateTime.Now
        };

        var descarga = _mapper.Map<DescargaAudiolibro>(nuevaDescarga);
        _unitOfWork.DescargaAudiolibroRepository.AddAsync(descarga);
        await _unitOfWork.SaveAsync();
        return true;
    }
}
