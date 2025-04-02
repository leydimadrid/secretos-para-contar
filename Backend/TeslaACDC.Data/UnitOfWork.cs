using System;
using Microsoft.EntityFrameworkCore;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Data;

public class UnitOfWork : IUnitOfWork
{
    internal TeslaContext _context;
    private IRepository<int, Autor> _autorRepository;
    private IRepository<int, Libro> _libroRepository;
    private IRepository<int, Audiolibro> _audiolibroRepository;
    private IRepository<int, Genero> _generoRepository;
    private IRepository<int, DescargaLibro> _descargaLibroRepository;
    private IRepository<int, DescargaAudiolibro> _descargaAudiolibroRepository;
    private IRepository<int, Escucha> _escuchaRepository;
    private IRepository<int, Lectura> _lecturaRepository;
    private IRepository<int, LibroAutor> _libroAutorRepository;
    private IRepository<int, LibroGenero> _libroGeneroRepository;
    private IRepository<int, Donacion> _donacionRepository;
    private IUserRepository _userRepository;


    private bool _disposed = false;

    public UnitOfWork(TeslaContext context)
    {
        _context = context;

    }


    public IRepository<int, Autor> AutorRepository
    {
        get
        {
            _autorRepository ??= new Repository<int, Autor>(_context);
            return _autorRepository;
        }
    }

    public IRepository<int, Libro> LibroRepository
    {
        get
        {
            _libroRepository ??= new Repository<int, Libro>(_context);
            return _libroRepository;
        }
    }

    public IRepository<int, Audiolibro> AudiolibroRepository
    {
        get
        {
            _audiolibroRepository ??= new Repository<int, Audiolibro>(_context);
            return _audiolibroRepository;
        }
    }

    public IRepository<int, Genero> GeneroRepository
    {
        get
        {
            _generoRepository ??= new Repository<int, Genero>(_context);
            return _generoRepository;
        }
    }

    public IRepository<int, DescargaLibro> DescargaLibroRepository
    {
        get
        {
            _descargaLibroRepository ??= new Repository<int, DescargaLibro>(_context);
            return _descargaLibroRepository;
        }
    }

    public IRepository<int, DescargaAudiolibro> DescargaAudiolibroRepository
    {
        get
        {
            _descargaAudiolibroRepository ??= new Repository<int, DescargaAudiolibro>(_context);
            return _descargaAudiolibroRepository;
        }
    }

    public IRepository<int, Lectura> LecturaRepository
    {
        get
        {
            _lecturaRepository ??= new Repository<int, Lectura>(_context);
            return _lecturaRepository;
        }
    }

    public IRepository<int, Escucha> EscuchaRepository
    {
        get
        {
            _escuchaRepository ??= new Repository<int, Escucha>(_context);
            return _escuchaRepository;
        }
    }

    public IRepository<int, Donacion> DonacionRepository
    {
        get
        {
            _donacionRepository ??= new Repository<int, Donacion>(_context);
            return _donacionRepository;
        }
    }

    public IRepository<int, LibroAutor> LibroAutorRepository
    {
        get
        {
            _libroAutorRepository ??= new Repository<int, LibroAutor>(_context);
            return _libroAutorRepository;
        }
    }

    public IRepository<int, LibroGenero> LibroGeneroRepository
    {
        get
        {
            _libroGeneroRepository ??= new Repository<int, LibroGenero>(_context);
            return _libroGeneroRepository;
        }
    }

    public IUserRepository UserRepository
    {
        get
        {
            _userRepository ??= new UserRepository(_context);
            return _userRepository;
        }
    }

    public async Task SaveAsync()
    {
        try
        {
            await _context.SaveChangesAsync().ConfigureAwait(false);
        }
        catch (DbUpdateConcurrencyException ex)
        {
            ex.Entries.Single().Reload();

        }
    }

    #region IDisposable
    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _context.DisposeAsync();
            }
        }
        _disposed = true;
    }
    public void Dispose()
    {
        Dispose(true);
    }

    #endregion
}
