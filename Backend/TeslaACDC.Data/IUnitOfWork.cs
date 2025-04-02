using System;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Data;

public interface IUnitOfWork
{
    IRepository<int, Autor> AutorRepository { get; }
    IRepository<int, Libro> LibroRepository { get; }
    IRepository<int, Audiolibro> AudiolibroRepository { get; }
    IRepository<int, Genero> GeneroRepository { get; }
    IRepository<int, DescargaLibro> DescargaLibroRepository { get; }
    IRepository<int, DescargaAudiolibro> DescargaAudiolibroRepository { get; }
    IRepository<int, Lectura> LecturaRepository { get; }
    IRepository<int, Escucha> EscuchaRepository { get; }
    IRepository<int, Donacion> DonacionRepository { get; }
    IUserRepository UserRepository { get; }

    // Tablas intermedias
    IRepository<int, LibroAutor> LibroAutorRepository { get; }
    IRepository<int, LibroGenero> LibroGeneroRepository { get; }


    Task SaveAsync();
}
