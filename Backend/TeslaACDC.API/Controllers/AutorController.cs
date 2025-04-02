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
    public class AutorController : ControllerBase
    {
        private readonly IAutorService _autorService;

        public AutorController(IAutorService autorService)
        {
            _autorService = autorService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("autores")]
        public async Task<IActionResult> GetAllAutores()
        {
            var autores = await _autorService.GetAllAutores();
            return Ok(autores);
        }

        // [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateAutor([FromForm] AutorCrear autor)
        {
            var newAutor = await _autorService.CreateAutor(autor);
            return Ok(newAutor);
        }

        // [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> UpdateAutor(int id, [FromForm] AutorCrear autor)
        {
            var updatedAutor = await _autorService.UpdateAutor(id, autor);
            return Ok(updatedAutor);
        }

        // [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteAutor(int id)
        {
            var deleteAutor = await _autorService.DeleteAutor(id);
            return Ok(deleteAutor);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("Deactivate/{id}")]
        public async Task<IActionResult> DeactivateAutor(int id)
        {
            await _autorService.Deactivate(id);
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> FindAutorById(int id)
        {
            var autor = await _autorService.FindAutorById(id);
            return Ok(autor);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("nombre")]
        public async Task<IActionResult> FindAutorByNombre(string nombre)
        {
            var autor = await _autorService.FindAutorByNombre(nombre);
            return Ok(autor);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("nacionalidad")]
        public async Task<IActionResult> FindAutorByNacionalidad(string nacionalidad)
        {
            var autor = await _autorService.FindAutorByNacionalidad(nacionalidad);
            return Ok(autor);
        }



    }
}
