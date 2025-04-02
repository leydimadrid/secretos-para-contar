using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeslaACDC.Business.DTO;
using TeslaACDC.Business.Interfaces;
using TeslaACDC.Data.Models;

namespace TeslaACDC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AudiolibroController : ControllerBase
    {
        private readonly IAudiolibroService _audiolibroService;
        public AudiolibroController(IAudiolibroService audiolibroService)
        {
            _audiolibroService = audiolibroService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("audiolibros")]
        public async Task<IActionResult> GetAllAudiolibros()
        {
            var audiolibros = await _audiolibroService.GetAllAudiolibros();
            return Ok(audiolibros);
        }


        [AllowAnonymous]
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> FindById(int id)
        {
            var audiolibros = await _audiolibroService.FindById(id);
            return Ok(audiolibros);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> AddAudiolibro(AudiolibroResumen audiolibro)
        {
            var nuevoAudiolibro = await _audiolibroService.AddAudiolibro(audiolibro);
            return Ok(nuevoAudiolibro);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> UpdateAudiolibro(int id, AudiolibroResumen audiolibro)
        {
            var updatedAudiolibro = await _audiolibroService.UpdateAudiolibro(id, audiolibro);
            return Ok(updatedAudiolibro);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteAudiolibro(int id)
        {
            var deleteAudiolibro = await _audiolibroService.DeleteAudiolibro(id);
            return Ok(deleteAudiolibro);
        }

        [HttpGet("descargar/{id}")]
        public async Task<IActionResult> DescargarLibro(int id)
        {
            var registroDescargaExito = await _audiolibroService.RegistrarDescarga(id);
            if (!registroDescargaExito)
            {
                return NotFound("No se pudo registrar la descarga.");
            }

            var resultado = await _audiolibroService.DescargarAudiolibro(id);
            if (resultado.StatusCode != HttpStatusCode.OK || resultado.ResponseElements == null)
            {
                return NotFound(resultado.Message);
            }

            var fileBytes = resultado.ResponseElements.SelectMany(b => b).ToArray();
            var tipoArchivo = resultado.Message; // Ahora el tipo de archivo se devuelve en el mensaje

            return File(fileBytes, tipoArchivo, $"Audiolibro_{id}");
        }

    }
}
