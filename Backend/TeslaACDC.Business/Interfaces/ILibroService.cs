using System;
using TeslaACDC.Data.Models;
using TeslaACDC.Business.DTO;
using Microsoft.AspNetCore.Http;


namespace TeslaACDC.Business.Interfaces;

public interface ILibroService
{
    public Task<BaseMessage<LibroResumen>> GetAllLibros();
    public Task<BaseMessage<List<LibroResumen>>> GetLibrosFiltrados(int? autorId, int? generoId, string busqueda);
    public Task<BaseMessage<LibroCrear>> CreateLibro(LibroCrear libro);
    public Task<BaseMessage<LibroCrear>> UpdateLibro(int id, LibroCrear libro);
    public Task<BaseMessage<LibroCrear>> DeleteLibro(int id);
    public Task<BaseMessage<LibroDetalle>> FindLibroByTitulo(string titulo);
    public Task<BaseMessage<LibroDetalle>> FindLibroByFormato(string formato);
    public Task<BaseMessage<LibroDetalle>> FindLibroByAnio(int anio);
    public Task<BaseMessage<LibroDetalle>> FindLibroByEditorial(string editorial);
    public Task<BaseMessage<LibroDetalle>> FindLibroByISBN(string isbn);
    public Task<BaseMessage<LibroDetalle>> FindById(int id);

    public Task<BaseMessage<byte[]>> DescargarPDF(int id);
    public Task<bool> RegistrarDescargaPDF(int id);

}
