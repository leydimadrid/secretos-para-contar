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

    public async Task<BaseMessage<AudiolibroCrear>> CreateAudiolibro(AudiolibroCrear audiolibro)
    {
        // Verificar que el autor exista
        var autor = await _unitOfWork.AutorRepository.FindAsync(audiolibro.AutorId);
        if (autor == null)
        {
            return BuildMessage(new List<AudiolibroCrear>(), "Autor no encontrado", HttpStatusCode.NotFound, 0);
        }

        // Verificar que el género exista
        var genero = await _unitOfWork.GeneroRepository.FindAsync(audiolibro.GeneroId);
        if (genero == null)
        {
            return BuildMessage(new List<AudiolibroCrear>(), "Género no encontrado", HttpStatusCode.NotFound, 0);
        }

        // Verificar que el archivo sea un .mp3 o un .mp4
        if (audiolibro.PathArchivo == null || (audiolibro.PathArchivo.ContentType != "audio/mpeg" && audiolibro.PathArchivo.ContentType != "video/mp4"))
        {
            return BuildMessage(new List<AudiolibroCrear>(), "El archivo debe ser un .mp3 o un .mp4", HttpStatusCode.BadRequest, 0);
        }

        // Configurar la ruta de la carpeta para guardar la portada
        var carpetaPortadas = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "audiolibros", "portadasAudio");

        // Verificar si la carpeta existe, si no, crearla
        if (!Directory.Exists(carpetaPortadas))
        {
            Directory.CreateDirectory(carpetaPortadas);
        }

        // Guardar la portada en la carpeta
        var nombreArchivo = Guid.NewGuid().ToString() + ".jpg";
        var rutaArchivoPortada = Path.Combine(carpetaPortadas, nombreArchivo);

        // Convertir la portada de Base64 a un arreglo de bytes
        var bytesPortada = Convert.FromBase64String(audiolibro.Portada);

        // Guardar la portada en el archivo
        await File.WriteAllBytesAsync(rutaArchivoPortada, bytesPortada);

        // Configurar la ruta de la carpeta para guardar el archivo de audio o video
        var carpetaArchivos = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "audiolibros", "archivos");

        // Verificar si la carpeta existe, si no, crearla
        if (!Directory.Exists(carpetaArchivos))
        {
            Directory.CreateDirectory(carpetaArchivos);
        }

        // Guardar el archivo de audio o video en la carpeta
        var nombreArchivoAudio = Guid.NewGuid().ToString();

        // Determinar la extensión del archivo
        var extension = audiolibro.PathArchivo.ContentType == "audio/mpeg" ? ".mp3" : ".mp4";


        // Agregar la extensión al nombre del archivo
        nombreArchivoAudio += extension;
        var rutaArchivoAudio = Path.Combine(carpetaArchivos, nombreArchivoAudio);

        var rutaArchivo = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "audiolibros", "archivos", audiolibro.PathArchivo.FileName);
        // Guardar el archivo de audio o video en el archivo
        using (var stream = new FileStream(rutaArchivo, FileMode.Create))
        {
            await audiolibro.PathArchivo.CopyToAsync(stream);
        }
        // Crear un nuevo libro
        var audiolibroEntity = new Audiolibro
        {
            Titulo = audiolibro.Titulo,
            Duracion = audiolibro.Duracion,
            TamañoMB = audiolibro.TamañoMB,
            Narrador = audiolibro.Narrador,
            Portada = nombreArchivo,
            PathArchivo = rutaArchivo,
            Idioma = audiolibro.Idioma,
        };

        var audioLibroAutor = new AudiolibroAutor
        {
            AudiolibroId = audiolibroEntity.id,
            AutorId = audiolibro.AutorId
        };

        var audioLibroGenero = new AudiolibroGenero
        {
            AudiolibroId = audiolibroEntity.id,
            GeneroId = audiolibro.GeneroId
        };

        audiolibroEntity.AudiolibroGeneros.Add(audioLibroGenero);

        audiolibroEntity.AudiolibroAutores.Add(audioLibroAutor);

        // Agregar el audiolibro a la base de datos
        await _unitOfWork.AudiolibroRepository.AddAsync(audiolibroEntity);
        await _unitOfWork.SaveAsync();

        var audiolibroAgregado = _mapper.Map<AudiolibroCrear>(audiolibroEntity);


        return BuildMessage(new List<AudiolibroCrear> { audiolibroAgregado }, "", HttpStatusCode.OK, 1);
    }

    public async Task<BaseMessage<AudiolibroCrear>> UpdateAudiolibro(int id, AudiolibroCrear audiolibro)
    {
        var AudiolibroEntity = await _unitOfWork.AudiolibroRepository.FindAsync(id);
        if (AudiolibroEntity == null)
        {
            return BuildMessage(new List<AudiolibroCrear>(), "Audio libro no encontrado", HttpStatusCode.NotFound, 0);
        }

        AudiolibroEntity.Titulo = audiolibro.Titulo;
        AudiolibroEntity.Duracion = audiolibro.Duracion;
        AudiolibroEntity.TamañoMB = audiolibro.TamañoMB;
        AudiolibroEntity.Narrador = audiolibro.Narrador;
        AudiolibroEntity.Idioma = audiolibro.Idioma;

        // Eliminar las relaciones existentes de autor y género
        var autoresAntiguos = await _unitOfWork.AudiolibroAutorRepository.GetAllAsync(la => la.AudiolibroId == id);
        var generosAntiguos = await _unitOfWork.AudiolibroGeneroRepository.GetAllAsync(lg => lg.AudiolibroId == id);

        foreach (var autorAntiguo in autoresAntiguos)
        {
            _unitOfWork.AudiolibroAutorRepository.Delete(autorAntiguo);
        }

        foreach (var generoAntiguo in generosAntiguos)
        {
            _unitOfWork.AudiolibroGeneroRepository.Delete(generoAntiguo);
        }

        // Agregar las nuevas relaciones de autor y género
        if (audiolibro.AutorId != 0)
        {
            var autor = await _unitOfWork.AutorRepository.FindAsync(audiolibro.AutorId);
            if (autor != null)
            {
                var audiolibroAutor = new AudiolibroAutor
                {
                    AudiolibroId = AudiolibroEntity.id,
                    AutorId = autor.id
                };
                _unitOfWork.AudiolibroAutorRepository.AddAsync(audiolibroAutor);
            }
        }

        if (audiolibro.GeneroId != 0)
        {
            var genero = await _unitOfWork.GeneroRepository.FindAsync(audiolibro.GeneroId);
            if (genero != null)
            {
                var audiolibroGenero = new AudiolibroGenero
                {
                    AudiolibroId = AudiolibroEntity.id,
                    GeneroId = genero.id
                };
                _unitOfWork.AudiolibroGeneroRepository.AddAsync(audiolibroGenero);
            }
        }

        // Actualizar la portada y el archivo si es necesario
        if (!string.IsNullOrEmpty(audiolibro.Portada))
        {
            var carpetaPortadas = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "audiolibros", "portadasAudio");
            if (!Directory.Exists(carpetaPortadas))
            {
                Directory.CreateDirectory(carpetaPortadas);
            }

            var nombreArchivo = Guid.NewGuid().ToString() + ".jpg";
            var rutaArchivoPortada = Path.Combine(carpetaPortadas, nombreArchivo);

            var bytesPortada = Convert.FromBase64String(audiolibro.Portada);
            await File.WriteAllBytesAsync(rutaArchivoPortada, bytesPortada);

            AudiolibroEntity.Portada = nombreArchivo;
        }

        if (audiolibro.PathArchivo != null)
        {
            var rutaArchivo = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "audiolibros", "archivos", audiolibro.PathArchivo.FileName);
            using (var stream = new FileStream(rutaArchivo, FileMode.Create))
            {
                await audiolibro.PathArchivo.CopyToAsync(stream);
            }

            AudiolibroEntity.PathArchivo = audiolibro.PathArchivo.FileName;
        }


        _unitOfWork.AudiolibroRepository.Update(AudiolibroEntity);
        await _unitOfWork.SaveAsync();

        var audiolibroActualizado = _mapper.Map<AudiolibroCrear>(AudiolibroEntity);

        return BuildMessage(new List<AudiolibroCrear> { audiolibroActualizado }, "", HttpStatusCode.OK, 1);

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

    public async Task<BaseMessage<AudiolibroCrear>> DeleteAudiolibro(int id)
    {
        var audiolibro = await _unitOfWork.AudiolibroRepository.FindAsync(id);
        if (audiolibro == null)
        {
            return BuildMessage(new List<AudiolibroCrear>(), "Audio libro no encontrado", HttpStatusCode.NotFound, 0);
        }

        _unitOfWork.AudiolibroRepository.Delete(audiolibro);
        await _unitOfWork.SaveAsync();

        var audiolibroEliminado = _mapper.Map<AudiolibroCrear>(audiolibro);

        return BuildMessage(new List<AudiolibroCrear> { audiolibroEliminado }, "", HttpStatusCode.OK, 1);
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

        var rutaArchivo = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "audiolibros", "archivos", audiolibro.PathArchivo);
        var archivo = new FileInfo(rutaArchivo);
        if (!archivo.Exists)
        {
            return BuildMessage<byte[]>(null, "No se pudo encontrar el archivo.", HttpStatusCode.NotFound, 0);
        }

        var extension = archivo.Extension.ToLower();
        if (extension != ".mp3" && extension != ".mp4")
        {
            return BuildMessage<byte[]>(null, "El archivo no es un mp3 o mp4.", HttpStatusCode.BadRequest, 0);
        }

        var bytesArchivo = await File.ReadAllBytesAsync(rutaArchivo);
        var tipoArchivo = extension == ".mp3" ? "audio/mp3" : "video/mp4";
        return BuildMessage(new List<byte[]> { bytesArchivo }, tipoArchivo, HttpStatusCode.OK, 0);
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
