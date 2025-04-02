using System.Net;
using TeslaACDC.Business.Interfaces;
using TeslaACDC.Data;
using TeslaACDC.Data.Models;
using System.Globalization;
using System.Text;
using AutoMapper;
using TeslaACDC.Business.DTO;

namespace TeslaACDC.Business.Services;

public class AutorService : IAutorService
{
    private readonly IUnitOfWork _unitOfWork;

    private readonly IMapper _mapper;


    public AutorService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }


    public async Task<BaseMessage<AutorResumen>> GetAllAutores()
    {
        var lista = await _unitOfWork.AutorRepository.GetAllAsync(includeProperties: "AutorGeneros.Genero");

        var listaMapeada = lista.Select(l => new AutorResumen
        {
            id = l.id,
            Nombre = l.Nombre,
            Apellidos = l.Apellidos,
            Nacionalidad = l.Nacionalidad,
            Foto = l.Foto,
            Generos = string.Join(", ", l.AutorGeneros?.Select(lg => lg.Genero.Nombre) ?? Array.Empty<string>()),
        }).ToList();
        return lista.Any()
            ? BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.OK, lista.Count())
            : BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<AutorCrear>> CreateAutor(AutorCrear autor)
    {
        // Verificar que el género exista
        var genero = await _unitOfWork.GeneroRepository.FindAsync(autor.GeneroId);
        if (genero == null)
        {
            return BuildMessage(new List<AutorCrear>(), "Género no encontrado", HttpStatusCode.NotFound, 0);
        }

        // Configurar la ruta de la carpeta para guardar la foto
        var carpetaPortadas = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "autores");

        // Verificar si la carpeta existe, si no, crearla
        if (!Directory.Exists(carpetaPortadas))
        {
            Directory.CreateDirectory(carpetaPortadas);
        }

        // Guardar la foto en la carpeta
        var nombreArchivo = Guid.NewGuid().ToString() + ".jpg";
        var rutaArchivoFoto = Path.Combine(carpetaPortadas, nombreArchivo);

        // Convertir la foto de Base64 a un arreglo de bytes
        var bytesPortada = Convert.FromBase64String(autor.Foto);

        // Guardar la foto en el archivo
        await File.WriteAllBytesAsync(rutaArchivoFoto, bytesPortada);


        // Crear un nuevo autor
        var autorEntity = new Autor
        {
            Nombre = autor.Nombre,
            Apellidos = autor.Apellido,
            Foto = nombreArchivo,
            Nacionalidad = autor.Nacionalidad,
            Biografia = autor.Biografia,
            Idioma = autor.Idioma,
        };

        // Crea un nuevo objeto LibroGenero y lo agrega a la colección de LibroGeneros
        var autorGenero = new AutorGenero
        {
            AutorId = autorEntity.id,
            GeneroId = autor.GeneroId
        };
        autorEntity.AutorGeneros.Add(autorGenero);


        await _unitOfWork.AutorRepository.AddAsync(autorEntity);
        await _unitOfWork.SaveAsync();

        // Devolver el autor creado
        var autorDetalle = _mapper.Map<AutorCrear>(autorEntity);

        return BuildMessage(new List<AutorCrear> { autorDetalle }, "", HttpStatusCode.OK, 1);
    }

    public async Task<BaseMessage<AutorCrear>> UpdateAutor(int id, AutorCrear autor)
    {

        var autorEntity = await _unitOfWork.AutorRepository.FindAsync(id);
        if (autorEntity == null)
        {
            return BuildMessage(new List<AutorCrear>(), "Autor no encontrado", HttpStatusCode.NotFound, 0);
        }


        autorEntity.Nombre = autor.Nombre;
        autorEntity.Apellidos = autor.Apellido;
        autorEntity.Nacionalidad = autor.Nacionalidad;
        autorEntity.Biografia = autor.Biografia;
        autorEntity.Idioma = autor.Idioma;

        if (!string.IsNullOrEmpty(autor.Foto))
        {
            var carpetaPortadas = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "autores");
            if (!Directory.Exists(carpetaPortadas))
            {
                Directory.CreateDirectory(carpetaPortadas);
            }

            var nombreArchivo = Guid.NewGuid().ToString() + ".jpg";
            var rutaArchivoFoto = Path.Combine(carpetaPortadas, nombreArchivo);

            var bytesPortada = Convert.FromBase64String(autor.Foto);
            await File.WriteAllBytesAsync(rutaArchivoFoto, bytesPortada);

            autorEntity.Foto = nombreArchivo;
        }


        _unitOfWork.AutorRepository.Update(autorEntity);
        await _unitOfWork.SaveAsync();

        var autorActualizado = _mapper.Map<AutorCrear>(autorEntity);

        return BuildMessage(new List<AutorCrear> { autorActualizado }, "", HttpStatusCode.OK, 1);

    }

    public async Task<BaseMessage<AutorCrear>> DeleteAutor(int id)
    {
        var autor = await _unitOfWork.AutorRepository.FindAsync(id);
        if (autor == null)
        {
            return BuildMessage(new List<AutorCrear>(), "Autor no encontrado", HttpStatusCode.NotFound, 0);
        }

        _unitOfWork.AutorRepository.Delete(autor);
        await _unitOfWork.SaveAsync();

        var autorEliminado = _mapper.Map<AutorCrear>(autor);

        return BuildMessage(new List<AutorCrear> { autorEliminado }, "", HttpStatusCode.OK, 1);
    }


    public async Task Deactivate(int id)
    {
        await _unitOfWork.AutorRepository.Deactivate(id);
    }

    public async Task<BaseMessage<AutorDetalle>> FindAutorById(int id)
    {
        // 1. Primero verificamos si el autor existe
        var autor = await _unitOfWork.AutorRepository.FindAsync(id);

        if (autor == null)
        {
            return BuildMessage(new List<AutorDetalle>(), "Autor no encontrado", HttpStatusCode.NotFound, 0);
        }

        // 2. Obtenemos el autor con todas sus entidades relacionadas
        // Incluimos AutorGeneros.Genero para obtener los géneros del autor
        var autorConRelaciones = await _unitOfWork.AutorRepository.GetAllAsync(
            filter: a => a.id == id,
            includeProperties: "LibroAutores.Libro,AutorGeneros.Genero");

        var autorCompleto = autorConRelaciones.FirstOrDefault();

        if (autorCompleto == null)
        {
            return BuildMessage(new List<AutorDetalle>(), "Autor no encontrado", HttpStatusCode.NotFound, 0);
        }

        // 3. Obtenemos los IDs de los libros del autor
        var librosIds = autorCompleto.LibroAutores?.Select(la => la.LibroId).ToList() ?? new List<int>();

        // 4. Obtenemos otros libros del mismo autor (si hay más de uno)
        // No necesitamos filtrar por id != id ya que estamos buscando libros, no autores
        var librosDelAutor = await _unitOfWork.LibroRepository.GetAllAsync(
            filter: l => librosIds.Contains(l.id),
            includeProperties: "LibroAutores.Autor,LibroGeneros.Genero");


        // 6. Mapeamos el autor a AutorModel
        var autorMapeado = new AutorDetalle
        {
            id = autorCompleto.id,
            Nombre = autorCompleto.Nombre,
            Apellidos = autorCompleto.Apellidos,
            Seudonimo = autorCompleto.Seudonimo,
            Foto = autorCompleto.Foto,
            FechaNacimiento = autorCompleto.FechaNacimiento,
            Pais = autorCompleto.Pais,
            Nacionalidad = autorCompleto.Nacionalidad,
            EstaVivo = autorCompleto.EstaVivo,
            Biografia = autorCompleto.Biografia,
            Generos = string.Join(", ", autorCompleto.AutorGeneros?.Select(ag => ag.Genero.Nombre) ?? Array.Empty<string>()),
            Idioma = autorCompleto.Idioma,


            // Mapeamos los libros del autor
            LibrosRelacionados = librosDelAutor.Select(l => new LibroResumen
            {
                id = l.id,
                Titulo = l.Titulo,
                Autor = string.Join(", ", l.LibroAutores?.Select(la => la.Autor.Nombre + " " + la.Autor.Apellidos) ?? Array.Empty<string>()),
                Portada = l.Portada,
                Genero = string.Join(", ", l.LibroGeneros?.Select(lg => lg.Genero.Nombre) ?? Array.Empty<string>())
            }).Take(4).ToList() // Limitamos a 4 libros
        };

        var resultado = new List<AutorDetalle> { autorMapeado };

        return BuildMessage(resultado, "", HttpStatusCode.OK, 1);
    }
    public async Task<BaseMessage<AutorResumen>> FindAutorByNombre(string nombre)
    {

        string nombreNormalizado = RemoveAccents(nombre.ToLower());

        var lista = (await _unitOfWork.AutorRepository.GetAllAsync())
            .AsEnumerable()
            .Where(x =>
                RemoveAccents(x.Nombre.ToLower()).Contains(nombreNormalizado) ||
                RemoveAccents(x.Apellidos.ToLower()).Contains(nombreNormalizado)
            ).ToList();

        var listaMapeada = _mapper.Map<List<AutorResumen>>(lista);

        return listaMapeada.Any()
                        ? BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.OK, lista.Count())
                        : BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<AutorResumen>> FindAutorByNacionalidad(string nacionalidad)
    {
        var lista = await _unitOfWork.AutorRepository.GetAllAsync(x =>
                x.Nacionalidad.ToLower().Contains(nacionalidad.ToLower()));

        var listaMapeada = _mapper.Map<List<AutorResumen>>(lista);

        return listaMapeada.Any()
            ? BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.OK, lista.Count())
            : BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.NotFound, 0);
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

    // Método para eliminar tildes y caracteres diacríticos
    private static string RemoveAccents(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return text;

        return new string(text
            .Normalize(NormalizationForm.FormD) // Descompone caracteres con tilde en su forma base
            .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark) // Filtra las tildes
            .ToArray());
    }
}
