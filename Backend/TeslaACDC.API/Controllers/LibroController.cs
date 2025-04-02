using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeslaACDC.Business.Interfaces;
using TeslaACDC.Business.DTO;
using TeslaACDC.Data.Models;
using System.Net;

namespace TeslaACDC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibroController : ControllerBase
    {
        private readonly ILibroService _libroService;

        public LibroController(ILibroService libroService)
        {
            _libroService = libroService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("libros")]
        public async Task<IActionResult> GetAllLibros()
        {
            var libros = await _libroService.GetAllLibros();
            return Ok(libros);
        }

        [HttpGet]
        [Route("filtrar")]
        [ProducesResponseType(typeof(BaseMessage<List<LibroResumen>>), 200)]
        public async Task<IActionResult> GetLibrosFiltrados(
        [FromQuery] int? autorId = null,
        [FromQuery] int? generoId = null,
        [FromQuery] string busqueda = null)
        {
            try
            {
                var resultado = await _libroService.GetLibrosFiltrados(autorId, generoId, busqueda);
                if (resultado.ResponseElements.Count == 0)
                {
                    return NotFound("No se encontraron registros que coincidan con la búsqueda");
                }
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al realizar la búsqueda: " + ex.Message);
            }
        }
        // [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CrearLibro([FromForm] LibroCrear libro)
        {
            var resultado = await _libroService.CreateLibro(libro);
            return Ok(resultado);
        }


        // [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> UpdateLibro(int id, [FromForm] LibroCrear libroModel)
        {
            var updatedLibro = await _libroService.UpdateLibro(id, libroModel);
            return Ok(updatedLibro);
        }

        // [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteLibro(int id)
        {
            var deleteLibro = await _libroService.DeleteLibro(id);
            return Ok(deleteLibro);
        }


        [AllowAnonymous]
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> FindById(int id)
        {
            var libro = await _libroService.FindById(id);
            return Ok(libro);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("titulo")]
        public async Task<IActionResult> FindLibroByTitulo(string titulo)
        {
            var libro = await _libroService.FindLibroByTitulo(titulo);
            return Ok(libro);
        }


        [AllowAnonymous]
        [HttpGet]
        [Route("formato")]
        public async Task<IActionResult> FindLibroByFormato(string formato)
        {
            var libro = await _libroService.FindLibroByFormato(formato);
            return Ok(libro);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("anio")]
        public async Task<IActionResult> FindLibroByAnio(int anio)
        {
            var libro = await _libroService.FindLibroByAnio(anio);
            return Ok(libro);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("editorial")]
        public async Task<IActionResult> FindLibroByEditorial(string editorial)
        {
            var libro = await _libroService.FindLibroByEditorial(editorial);
            return Ok(libro);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("isbn")]
        public async Task<IActionResult> FindLibroByISBN(string isbn)
        {
            var libro = await _libroService.FindLibroByISBN(isbn);
            return Ok(libro);
        }

        [HttpGet("descargar/{id}")]
        public async Task<IActionResult> DescargarLibro(int id)
        {
            // Registrar la descarga
            var registroDescargaExito = await _libroService.RegistrarDescargaPDF(id);
            if (!registroDescargaExito)
            {
                return NotFound("No se pudo registrar la descarga.");
            }

            // Descargar el libro
            var resultado = await _libroService.DescargarPDF(id);
            if (resultado.StatusCode != HttpStatusCode.OK)
            {
                return NotFound(resultado.Message);
            }

            // Devolver el archivo PDF
            return File(resultado.ResponseElements.First(), "application/pdf", $"Libro_{id}.pdf");
        }
    }
}
