using System.Globalization;
using System.Net;
using System.Text;
using TeslaACDC.Business.Interfaces;
using TeslaACDC.Data;
using TeslaACDC.Business.DTO;
using TeslaACDC.Data.Models;
using FluentValidation;
using FluentValidation.Results;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;


namespace TeslaACDC.Business.Services;

public class LibroService : ILibroService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    private readonly FileStorageConfig _fileStorageConfig;

    public LibroService(IUnitOfWork unitOfWork, IMapper mapper, FileStorageConfig fileStorageConfig)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _fileStorageConfig = fileStorageConfig;
    }

    public async Task<BaseMessage<LibroResumen>> GetAllLibros()
    {
        var librosConRelaciones = await _unitOfWork.LibroRepository.GetAllAsync(
            includeProperties: "LibroAutores.Autor,LibroGeneros.Genero");

        var librosResumen = librosConRelaciones.Select(l => new LibroResumen
        {
            id = l.id,
            Titulo = l.Titulo,
            Portada = l.Portada,
            Autor = string.Join(", ", l.LibroAutores.Select(la => la.Autor.Nombre + " " + la.Autor.Apellidos)),
            Genero = string.Join(", ", l.LibroGeneros?.Select(lg => lg.Genero.Nombre) ?? Array.Empty<string>()),
        }).AsEnumerable();

        return librosResumen.Any()
            ? BuildMessage(librosResumen.ToList(), "", HttpStatusCode.OK, librosResumen.Count())
            : BuildMessage(librosResumen.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<List<LibroResumen>>> GetLibrosFiltrados(
         int? autorId,
         int? generoId,
         string busqueda)
    {
        var libros = await _unitOfWork.LibroRepository.GetAllAsync(
        includeProperties: "LibroAutores.Autor,LibroGeneros.Genero");


        if (autorId.HasValue)
        {
            libros = libros.Where(l => l.LibroAutores.Any(a => a.AutorId == autorId.Value));
        }

        if (generoId.HasValue)
        {
            libros = libros.Where(l => l.LibroGeneros.Any(g => g.GeneroId == generoId.Value));
        }

        if (!string.IsNullOrEmpty(busqueda))
        {
            libros = libros.Where(l => l.Titulo.Contains(busqueda, StringComparison.OrdinalIgnoreCase) ||
                                      l.Editorial.Contains(busqueda, StringComparison.OrdinalIgnoreCase) ||
                                      l.ContraPortada.Contains(busqueda, StringComparison.OrdinalIgnoreCase) ||
                                      l.LibroAutores.Any(a => a.Autor.Nombre.Contains(busqueda, StringComparison.OrdinalIgnoreCase)) ||
                                      l.LibroGeneros.Any(g => g.Genero.Nombre.Contains(busqueda, StringComparison.OrdinalIgnoreCase)));
        }

        var librosFiltrados = libros.Select(l => new LibroResumen
        {
            id = l.id,
            Titulo = l.Titulo,
            Portada = l.Portada,
            Autor = string.Join(", ", l.LibroAutores.Select(la => la.Autor.Nombre + " " + la.Autor.Apellidos)),
            Genero = string.Join(", ", l.LibroGeneros?.Select(lg => lg.Genero.Nombre) ?? Array.Empty<string>())
        }).ToList();

        return librosFiltrados.Any()
       ? BuildMessage(new List<List<LibroResumen>> { librosFiltrados }, "", HttpStatusCode.OK, librosFiltrados.Count)
       : BuildMessage(new List<List<LibroResumen>> { librosFiltrados }, "", HttpStatusCode.NotFound, 0);
    }


    public async Task<BaseMessage<LibroDetalle>> FindById(int id)
    {
        var libro = await _unitOfWork.LibroRepository.FindAsync(id);

        if (libro == null)
        {
            return BuildMessage(new List<LibroDetalle>(), "Libro no encontrado", HttpStatusCode.NotFound, 0);
        }

        var libroConRelaciones = await _unitOfWork.LibroRepository.GetAllAsync(
            filter: l => l.id == id,
            includeProperties: "LibroAutores.Autor,LibroGeneros.Genero");

        var libroCompleto = libroConRelaciones.FirstOrDefault();

        if (libroCompleto == null)
        {
            return BuildMessage(new List<LibroDetalle>(), "Libro no encontrado", HttpStatusCode.NotFound, 0);
        }

        var generosIds = libroCompleto.LibroGeneros?.Select(lg => lg.GeneroId).ToList() ?? new List<int>();

        var librosRelacionados = await _unitOfWork.LibroRepository.GetAllAsync(
            filter: l => l.id != id && l.LibroGeneros.Any(lg => generosIds.Contains(lg.GeneroId)),
            includeProperties: "LibroAutores.Autor,LibroGeneros.Genero");

        int totalDescargas = await _unitOfWork.DescargaLibroRepository.CountAsync(d => d.LibroId == id);
        int totalLecturas = await _unitOfWork.LecturaRepository.CountAsync(l => l.LibroId == id);

        var libroMapeado = new LibroDetalle
        {
            id = libroCompleto.id,
            Titulo = libroCompleto.Titulo,
            ISBN13 = libroCompleto.ISBN13 ?? string.Empty,
            Editorial = libroCompleto.Editorial ?? string.Empty,
            AnioPublicacion = libroCompleto.AnioPublicacion,
            Portada = libroCompleto.Portada,
            ContraPortada = libroCompleto.ContraPortada ?? string.Empty,
            Autor = string.Join(", ", libroCompleto.LibroAutores?.Select(la => la.Autor.Nombre + " " + la.Autor.Apellidos) ?? Array.Empty<string>()),
            Genero = string.Join(", ", libroCompleto.LibroGeneros?.Select(lg => lg.Genero.Nombre) ?? Array.Empty<string>()),
            Idioma = libroCompleto.Idioma,
            TotalDescargas = totalDescargas,
            TotalLecturas = totalLecturas,

            LibrosRelacionados = librosRelacionados.Select(l => new LibroResumen
            {
                id = l.id,
                Titulo = l.Titulo,
                Autor = string.Join(", ", l.LibroAutores?.Select(la => la.Autor.Nombre) ?? Array.Empty<string>()),
                Portada = l.Portada,
                Genero = string.Join(", ", l.LibroGeneros?.Select(lg => lg.Genero.Nombre) ?? Array.Empty<string>())
            }).Take(4).ToList()
        };

        var resultado = new List<LibroDetalle> { libroMapeado };

        return BuildMessage(resultado, "", HttpStatusCode.OK, 1);
    }

    public async Task<BaseMessage<LibroCrear>> CreateLibro(LibroCrear libro)
    {
        // Verificar que el autor exista
        var autor = await _unitOfWork.AutorRepository.FindAsync(libro.AutorId);
        if (autor == null)
        {
            return BuildMessage(new List<LibroCrear>(), "Autor no encontrado", HttpStatusCode.NotFound, 0);
        }

        // Verificar que el género exista
        var genero = await _unitOfWork.GeneroRepository.FindAsync(libro.GeneroId);
        if (genero == null)
        {
            return BuildMessage(new List<LibroCrear>(), "Género no encontrado", HttpStatusCode.NotFound, 0);
        }

        // Configurar la ruta de la carpeta para guardar la portada
        var carpetaPortadas = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "libros", "portadas");

        // Verificar si la carpeta existe, si no, crearla
        if (!Directory.Exists(carpetaPortadas))
        {
            Directory.CreateDirectory(carpetaPortadas);
        }

        // Guardar la portada en la carpeta
        var nombreArchivo = Guid.NewGuid().ToString() + ".jpg";
        var rutaArchivoPortada = Path.Combine(carpetaPortadas, nombreArchivo);

        // Convertir la portada de Base64 a un arreglo de bytes
        var bytesPortada = Convert.FromBase64String(libro.Portada);

        // Guardar la portada en el archivo
        await File.WriteAllBytesAsync(rutaArchivoPortada, bytesPortada);

        // Guardar el archivo PDF
        var rutaArchivo = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "libros", "pdf", libro.Pdf.FileName);
        using (var stream = new FileStream(rutaArchivo, FileMode.Create))
        {
            await libro.Pdf.CopyToAsync(stream);
        }

        // Crear un nuevo libro
        var libroEntity = new Libro
        {
            Titulo = libro.Titulo,
            Editorial = libro.Editorial,
            ContraPortada = libro.ContraPortada,
            Portada = nombreArchivo,
            PathArchivo = rutaArchivo,
            Idioma = libro.Idioma,
            ISBN13 = libro.ISBN13
        };

        var libroAutor = new LibroAutor
        {
            LibroId = libroEntity.id,
            AutorId = libro.AutorId
        };
        libroEntity.LibroAutores.Add(libroAutor);

        var libroGenero = new LibroGenero
        {
            LibroId = libroEntity.id,
            GeneroId = libro.GeneroId
        };
        libroEntity.LibroGeneros.Add(libroGenero);

        // Agregar el libro a la base de datos
        _unitOfWork.LibroRepository.AddAsync(libroEntity);
        await _unitOfWork.SaveAsync();

        // Devolver el libro creado
        var libroDetalle = _mapper.Map<LibroCrear>(libroEntity);
        return BuildMessage(new List<LibroCrear> { libroDetalle }, "", HttpStatusCode.OK, 1);

    }

    public async Task<BaseMessage<LibroCrear>> UpdateLibro(int id, LibroCrear libro)
    {
        var libroEntity = await _unitOfWork.LibroRepository.FindAsync(id);

        if (libroEntity == null)
        {
            return BuildMessage(new List<LibroCrear>(), "Libro no encontrado", HttpStatusCode.NotFound, 0);
        }

        // Actualizar campos básicos
        libroEntity.Titulo = libro.Titulo;
        libroEntity.Editorial = libro.Editorial;
        libroEntity.ContraPortada = libro.ContraPortada;
        libroEntity.Idioma = libro.Idioma;
        libroEntity.ISBN13 = libro.ISBN13;

        // Eliminar las relaciones existentes de autor y género
        var autoresAntiguos = await _unitOfWork.LibroAutorRepository.GetAllAsync(la => la.LibroId == id);
        var generosAntiguos = await _unitOfWork.LibroGeneroRepository.GetAllAsync(lg => lg.LibroId == id);

        foreach (var autorAntiguo in autoresAntiguos)
        {
            _unitOfWork.LibroAutorRepository.Delete(autorAntiguo);
        }

        foreach (var generoAntiguo in generosAntiguos)
        {
            _unitOfWork.LibroGeneroRepository.Delete(generoAntiguo);
        }

        // Agregar las nuevas relaciones de autor y género
        if (libro.AutorId != 0)
        {
            var autor = await _unitOfWork.AutorRepository.FindAsync(libro.AutorId);
            if (autor != null)
            {
                var libroAutor = new LibroAutor
                {
                    LibroId = libroEntity.id,
                    AutorId = autor.id
                };
                _unitOfWork.LibroAutorRepository.AddAsync(libroAutor);
            }
        }

        if (libro.GeneroId != 0)
        {
            var genero = await _unitOfWork.GeneroRepository.FindAsync(libro.GeneroId);
            if (genero != null)
            {
                var libroGenero = new LibroGenero
                {
                    LibroId = libroEntity.id,
                    GeneroId = genero.id
                };
                _unitOfWork.LibroGeneroRepository.AddAsync(libroGenero);
            }
        }

        // Actualizar la portada y el archivo PDF si es necesario
        if (!string.IsNullOrEmpty(libro.Portada))
        {
            var carpetaPortadas = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "libros", "portadas");
            if (!Directory.Exists(carpetaPortadas))
            {
                Directory.CreateDirectory(carpetaPortadas);
            }

            var nombreArchivo = Guid.NewGuid().ToString() + ".jpg";
            var rutaArchivoPortada = Path.Combine(carpetaPortadas, nombreArchivo);

            var bytesPortada = Convert.FromBase64String(libro.Portada);
            await File.WriteAllBytesAsync(rutaArchivoPortada, bytesPortada);

            libroEntity.Portada = nombreArchivo;
        }

        if (libro.Pdf != null)
        {
            var rutaArchivo = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "libros", "pdf", libro.Pdf.FileName);
            using (var stream = new FileStream(rutaArchivo, FileMode.Create))
            {
                await libro.Pdf.CopyToAsync(stream);
            }

            libroEntity.PathArchivo = libro.Pdf.FileName;
        }

        _unitOfWork.LibroRepository.Update(libroEntity);
        await _unitOfWork.SaveAsync();

        var libroActualizado = _mapper.Map<LibroCrear>(libroEntity);
        return BuildMessage(new List<LibroCrear> { libroActualizado }, "", HttpStatusCode.OK, 1);
    }

    public async Task<BaseMessage<LibroCrear>> DeleteLibro(int id)
    {
        var libro = await _unitOfWork.LibroRepository.FindAsync(id);
        if (libro == null)
        {
            return BuildMessage(new List<LibroCrear>(), "Libro no encontrado", HttpStatusCode.NotFound, 0);
        }

        _unitOfWork.LibroRepository.Delete(libro);
        await _unitOfWork.SaveAsync();

        var libroEliminado = _mapper.Map<LibroCrear>(libro);

        return BuildMessage(new List<LibroCrear> { libroEliminado }, "", HttpStatusCode.OK, 1);
    }

    public async Task<BaseMessage<LibroDetalle>> FindLibroByTitulo(string titulo)
    {

        string nombreNormalizado = RemoveAccents(titulo.ToLower());

        var lista = (await _unitOfWork.LibroRepository.GetAllAsync())
            .AsEnumerable()
            .Where(x =>
                RemoveAccents(x.Titulo.ToLower()).Contains(nombreNormalizado)).ToList();

        var listaMapeada = _mapper.Map<List<LibroDetalle>>(lista);


        return listaMapeada.Any()
                    ? BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.OK, lista.Count())
                    : BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<LibroDetalle>> FindLibroByFormato(string formato)
    {
        string nombreNormalizado = RemoveAccents(formato.ToLower());

        var lista = (await _unitOfWork.LibroRepository.GetAllAsync())
            .AsEnumerable()
            .Where(x =>
                RemoveAccents(x.Formato.ToLower()).Contains(nombreNormalizado)).ToList();

        var listaMapeada = _mapper.Map<List<LibroDetalle>>(lista);

        return listaMapeada.Any()
                    ? BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.OK, lista.Count())
                    : BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<LibroDetalle>> FindLibroByAnio(int anio)
    {

        var lista = await _unitOfWork.LibroRepository.GetAllAsync(x =>
        x.AnioPublicacion == anio);


        var listaMapeada = _mapper.Map<List<LibroDetalle>>(lista);

        return lista.Any()
            ? BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.OK, lista.Count())
            : BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<LibroDetalle>> FindLibroByEditorial(string editorial)
    {

        var lista = await _unitOfWork.LibroRepository.GetAllAsync(x =>
        x.Editorial.ToLower().Contains(editorial));

        var listaMapeada = _mapper.Map<List<LibroDetalle>>(lista);

        return lista.Any()
            ? BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.OK, lista.Count())
            : BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<LibroDetalle>> FindLibroByISBN(string isbn)
    {

        var lista = await _unitOfWork.LibroRepository.GetAllAsync(x =>
        x.ISBN13.ToLower().Contains(isbn));

        var listaMapeada = _mapper.Map<List<LibroDetalle>>(lista);

        return lista.Any()
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


    public async Task<BaseMessage<byte[]>> DescargarPDF(int id)
    {
        var libro = await _unitOfWork.LibroRepository.FindAsync(id);

        if (libro == null)
        {
            return BuildMessage<byte[]>(new List<byte[]>(), "Libro no encontrado", HttpStatusCode.NotFound, 0);
        }

        var rutaArchivo = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "libros", "pdf", libro.PathArchivo);

        if (!File.Exists(rutaArchivo))
        {
            return BuildMessage<byte[]>(new List<byte[]>(), "Archivo no encontrado", HttpStatusCode.NotFound, 0);
        }

        var fileBytes = await File.ReadAllBytesAsync(rutaArchivo);

        return BuildMessage<byte[]>(new List<byte[]> { fileBytes }, "", HttpStatusCode.OK, fileBytes.Length);
    }

    public async Task<bool> RegistrarDescargaPDF(int id)
    {
        var nuevaDescarga = new DescargaModelLibro
        {
            LibroId = id,
            Fecha = DateTime.Now
        };

        var descarga = _mapper.Map<DescargaLibro>(nuevaDescarga);
        _unitOfWork.DescargaLibroRepository.AddAsync(descarga);
        await _unitOfWork.SaveAsync();
        return true;
    }

    // Método para eliminar tildes y caracteres
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